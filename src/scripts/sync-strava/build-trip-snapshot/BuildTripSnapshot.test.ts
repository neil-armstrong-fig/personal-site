import {expect, it} from "vitest";

import {buildTripSnapshot} from "./BuildTripSnapshot.ts";
import {tripSources} from "@src/scripts/shared/strava/trip-sources/TripSources.ts";
import type {StravaActivitySummary} from "@src/scripts/shared/strava/types/StravaActivitySummary.ts";
import type {TripSource} from "@src/scripts/shared/strava/types/TripSource.ts";

const source = tripSources.find(candidate => candidate.slug === "porto-to-faro");

if (source === undefined) {
  throw new Error("Missing porto-to-faro source");
}

const dayOne: StravaActivitySummary = {
  id: 11,
  name: "PTF Day 1: Race for the ferry",
  sport_type: "Ride",
  start_date_local: "2024-05-11T06:59:59Z",
  distance: 135_600.4,
  moving_time: 18_000,
  total_elevation_gain: 433.6,
  visibility: "everyone",
};

const dayTwo: StravaActivitySummary = {
  ...dayOne,
  id: 12,
  name: "PTF Day 2: Hills",
  start_date_local: "2024-05-12T23:30:00Z",
  distance: 134_100.2,
  total_elevation_gain: 1051,
  visibility: "followers_only",
};

it("records each day with its complete Strava name, local date, rounded measurements and public flag", () => {
  expect(buildTripSnapshot([dayOne, dayTwo], source).days).toEqual([
    {
      id: 11,
      date: "2024-05-11",
      name: "PTF Day 1: Race for the ferry",
      distanceMetres: 135_600,
      elevationMetres: 434,
      movingTimeSeconds: 18_000,
      public: true,
    },
    {
      id: 12,
      date: "2024-05-12",
      name: "PTF Day 2: Hills",
      distanceMetres: 134_100,
      elevationMetres: 1051,
      movingTimeSeconds: 18_000,
      public: false,
    },
  ]);
});

it("gives a trip with no outings an empty outings list", () => {
  expect(buildTripSnapshot([dayOne], source).outings).toEqual([]);
});

it("totals the rounded per-day values so the page adds up", () => {
  expect(buildTripSnapshot([dayOne, dayTwo], source).totals).toEqual({
    days: 2,
    transitionDays: 0,
    bonusRides: 0,
    distanceMetres: 269_700,
    elevationMetres: 1485,
    movingTimeSeconds: 36_000,
  });
});

it("keeps the local calendar date rather than shifting time zones", () => {
  expect(buildTripSnapshot([dayTwo], source).days[0]?.date).toBe("2024-05-12");
});

it("keeps a name that contains only the activity's day label", () => {
  expect(buildTripSnapshot([{...dayOne, name: "PTF Day 1"}], source).days[0]?.name).toBe("PTF Day 1");
});

it("never copies coordinates or maps from the source activity", () => {
  const withLocation = {...dayOne, start_latlng: [54.6, -5.9], map: {summary_polyline: "abc"}};

  expect(JSON.stringify(buildTripSnapshot([withLocation], source))).not.toMatch(/latlng|polyline|54\.6/);
});

it("numbers legs in order of first appearance and leaves single-leg trips unnumbered", () => {
  const loop = tripSources.find(candidate => candidate.slug === "loop-of-europe");

  if (loop === undefined) {
    throw new Error("Missing loop-of-europe source");
  }

  const snapshot = buildTripSnapshot(
    [
      {...dayOne, id: 1, name: "FT-RTR-1: a"},
      {...dayOne, id: 2, name: "FT-ATB-1: b"},
      {...dayOne, id: 3, name: "FT-rtr-2: c"},
    ],
    loop,
  );

  expect(snapshot.days.map(day => day.leg)).toEqual([1, 2, 1]);
  expect(buildTripSnapshot([dayOne], source).days[0]).not.toHaveProperty("leg");
});

it("records outings with their complete Strava name", () => {
  const walk: StravaActivitySummary = {
    ...dayOne,
    id: 9,
    name: "PTF: Lisbon: stroll",
    sport_type: "Hike",
    distance: 14_400,
    visibility: "everyone",
  };

  expect(buildTripSnapshot([dayOne], source, {outings: [walk]}).outings).toEqual([
    {
      id: 9,
      date: "2024-05-11",
      kind: "hike",
      name: "PTF: Lisbon: stroll",
      distanceMetres: 14_400,
      elevationMetres: 434,
      movingTimeSeconds: 18_000,
      public: true,
    },
  ]);
});

it("names legs from the source and flags transition days", () => {
  const source: TripSource = {
    slug: "test-trip",
    dayPattern: /^FT-(?<leg>[A-Z]+)-[1-9]\d*(?::\s*(?<title>.+))?$/i,
    prefixPattern: /^FT-/i,
    legs: {ABC: {name: "First leg"}, DEF: {name: "Second leg", transition: true}},
  };
  const snapshot = buildTripSnapshot(
    [
      {...dayOne, id: 1, name: "FT-ABC-1: a"},
      {...dayOne, id: 2, name: "FT-def-1: b"},
    ],
    source,
  );

  expect(snapshot.legs).toEqual([
    {number: 1, name: "First leg"},
    {number: 2, name: "Second leg"},
  ]);
  expect(snapshot.days.map(day => day.transition)).toEqual([undefined, true]);
  expect(snapshot.totals).toMatchObject({days: 1, transitionDays: 1});
});

it("excludes explicitly identified transition rides from days but retains their measurements", () => {
  const snapshot = buildTripSnapshot([dayOne, dayTwo], {...source, transitionActivityIds: [dayTwo.id]});

  expect(snapshot.days[1]).toMatchObject({id: dayTwo.id, transition: true});
  expect(snapshot.totals).toMatchObject({
    days: 1,
    transitionDays: 1,
    distanceMetres: 269_700,
    elevationMetres: 1485,
    movingTimeSeconds: 36_000,
  });
});

it("has no legs and no transition days for a trip without them", () => {
  const snapshot = buildTripSnapshot([dayOne], source);

  expect(snapshot.legs).toEqual([]);
  expect(snapshot.days[0]).not.toHaveProperty("transition");
  expect(snapshot.totals.transitionDays).toBe(0);
});

it("fails loudly when a leg code has no configured name", () => {
  const unnamed: TripSource = {
    slug: "test-trip",
    dayPattern: /^FT-(?<leg>[A-Z]+)-[1-9]\d*$/i,
    prefixPattern: /^FT-/i,
    legs: {ABC: {name: "Only"}},
  };

  expect(() => buildTripSnapshot([{...dayOne, name: "FT-XYZ-1"}], unnamed)).toThrow("XYZ");
});

it("keeps an outing name when it has no colon", () => {
  const walk: StravaActivitySummary = {...dayOne, id: 9, name: "RTR-Antwerping", sport_type: "Walk"};

  expect(buildTripSnapshot([dayOne], source, {outings: [walk]}).outings[0]?.name).toBe("RTR-Antwerping");
});

it("merges bonus rides into the days in date order, flagged, without counting them as days", () => {
  const bonus: StravaActivitySummary = {
    ...dayOne,
    id: 50,
    name: "PTF: Lisbon side quest",
    start_date_local: "2024-05-12T10:00:00Z",
    distance: 10_000,
    total_elevation_gain: 100,
  };
  const snapshot = buildTripSnapshot([dayOne, dayTwo], source, {bonusRides: [bonus]});

  expect(snapshot.days.map(day => day.id)).toEqual([11, 50, 12]);
  expect(snapshot.days[1]).toMatchObject({
    bonus: true,
    name: "PTF: Lisbon side quest",
    distanceMetres: 10_000,
  });
  expect(snapshot.days[0]).not.toHaveProperty("bonus");
  expect(snapshot.totals).toMatchObject({days: 2, bonusRides: 1, distanceMetres: 279_700, elevationMetres: 1585});
});

it("keeps a bonus ride's complete name and places it in its leg", () => {
  const legged: TripSource = {
    slug: "test-trip",
    dayPattern: /^FT-(?<leg>[A-Z]+)-[1-9]\d*(?::\s*(?<title>.+))?$/i,
    prefixPattern: /^FT-/i,
    legs: {ABC: {name: "First leg"}},
    bonusRides: {pattern: /^FT-(?<leg>[A-Z]+)(?::\s*(?<title>.+))?$/i},
  };
  const snapshot = buildTripSnapshot([{...dayOne, id: 1, name: "FT-ABC-1: a"}], legged, {
    bonusRides: [{...dayOne, id: 2, name: "FT-ABC: To the shop", start_date_local: "2024-05-11T12:00:00Z"}],
  });

  expect(snapshot.days[1]).toMatchObject({bonus: true, leg: 1, name: "FT-ABC: To the shop"});

  const plain = buildTripSnapshot([dayOne], source, {bonusRides: [{...dayOne, id: 3, name: "Would be a shame"}]});

  expect(plain.days.find(day => day.id === 3)?.name).toBe("Would be a shame");
});
