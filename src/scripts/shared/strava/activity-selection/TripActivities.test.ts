import {expect, it} from "vitest";

import {selectTripActivities} from "./TripActivities.ts";
import {selectTripBonusRides} from "./TripBonusRides.ts";
import {selectTripOutings} from "./TripOutings.ts";
import {tripSources} from "@src/scripts/shared/strava/trip-sources/TripSources.ts";
import type {StravaActivitySummary} from "@src/scripts/shared/strava/types/StravaActivitySummary.ts";
import type {TripSource} from "@src/scripts/shared/strava/types/TripSource.ts";

function activity(name: string, overrides: Partial<StravaActivitySummary> = {}): StravaActivitySummary {
  return {
    id: 1,
    name,
    sport_type: "Ride",
    start_date_local: "2023-08-18T09:00:00Z",
    distance: 100_000,
    moving_time: 20_000,
    total_elevation_gain: 900,
    visibility: "everyone",
    ...overrides,
  };
}

function selectedNames(slug: string, names: string[], overrides: Partial<StravaActivitySummary> = {}): string[] {
  const source = tripSources.find(candidate => candidate.slug === slug);

  if (source === undefined) {
    throw new Error(`Unknown trip source ${slug}`);
  }

  return selectTripActivities(
    names.map(name => activity(name, overrides)),
    source,
  ).map(selected => selected.name);
}

it("keeps only numbered day rides for a trip and drops practice and side rides", () => {
  expect(
    selectedNames("belfast-rotterdam-2023", [
      "BTR: Practice ride",
      "BTR: Day 1",
      "BTR: London city bike",
      "RTB: Day 4",
      "BTR2 Day 1: A ton on day 1",
    ]),
  ).toEqual(["BTR: Day 1", "RTB: Day 4"]);
});

it("does not treat day zero as a trip day", () => {
  expect(
    selectedNames("porto-to-faro", ["PTF Day 0: Wee bike check", "PTF Day 1: Race", "PTF: Lisbon side quest"]),
  ).toEqual(["PTF Day 1: Race"]);
});

it("separates the second Belfast-Rotterdam trip from the first", () => {
  expect(
    selectedNames("belfast-rotterdam-2024", ["BTR2 Day 1: A ton", "BTR2 Bonus: Headwinds", "RTB2 Day 4: Done"]),
  ).toEqual(["BTR2 Day 1: A ton", "RTB2 Day 4: Done"]);
});

it("matches day numbers case-insensitively", () => {
  expect(selectedNames("tokyo-to-seoul", ["TTS day 14: A relaxed day", "TTS: Tokyo dander"])).toEqual([
    "TTS day 14: A relaxed day",
  ]);
});

it("keeps RTR separate from the later RTR-prefixed activities of another trip", () => {
  expect(
    selectedNames("rotterdam-to-rotterdam", ["RTR Day 1: Back", "RTR-FT: Real Austrian food", "FT-RTR-1: Hairdryer"]),
  ).toEqual(["RTR Day 1: Back"]);
});

it("excludes walks, hikes and virtual rides even when the name matches", () => {
  expect(selectedNames("tokyo-to-seoul", ["TTS Day 3: Tuesday hilly"], {sport_type: "Walk"})).toEqual([]);
  expect(selectedNames("tokyo-to-seoul", ["TTS Day 3: Tuesday hilly"], {sport_type: "VirtualRide"})).toEqual([]);
  expect(selectedNames("tokyo-to-seoul", ["TTS Day 3: Tuesday hilly"], {sport_type: "GravelRide"})).toHaveLength(1);
});

it("orders selected activities by local start time", () => {
  const source = tripSources.find(candidate => candidate.slug === "porto-to-faro");
  const later = activity("PTF Day 2: b", {start_date_local: "2024-05-12T08:00:00Z"});
  const earlier = activity("PTF Day 1: a", {start_date_local: "2024-05-11T08:00:00Z"});

  expect(source && selectTripActivities([later, earlier], source).map(selected => selected.name)).toEqual([
    "PTF Day 1: a",
    "PTF Day 2: b",
  ]);
});

function sourceFor(slug: string): TripSource {
  const source = tripSources.find(candidate => candidate.slug === slug);

  if (source === undefined) {
    throw new Error(`Unknown trip source ${slug}`);
  }

  return source;
}

it("selects long walks and hikes carrying the trip prefix as outings", () => {
  const outings = selectTripOutings(
    [
      activity("TTS: Tokyo dander", {id: 1, sport_type: "Walk", distance: 23_000}),
      activity("TTS: Wee scoot up a hill", {id: 2, sport_type: "Walk", distance: 1_000}),
      activity("TTS: Long hike", {id: 3, sport_type: "Hike", distance: 12_000}),
      activity("TTS Day 3: Tuesday hilly", {id: 4}),
      activity("BTR: Some walk", {id: 5, sport_type: "Walk", distance: 20_000}),
    ],
    sourceFor("tokyo-to-seoul"),
  );

  expect(outings.map(outing => outing.id)).toEqual([1, 3]);
});

it("keeps the walks of the later trip out of the standalone RTR trip", () => {
  const walks = [
    activity("RTR: Antwerping", {sport_type: "Walk", distance: 15_000}),
    activity("RTR-FT: Real Austrian food", {sport_type: "Walk", distance: 15_000}),
    activity("FT-RTR: Castle district", {sport_type: "Walk", distance: 15_000}),
  ];

  expect(selectTripOutings(walks, sourceFor("rotterdam-to-rotterdam")).map(walk => walk.name)).toEqual([
    "RTR: Antwerping",
  ]);
  expect(selectTripOutings(walks, sourceFor("loop-of-europe")).map(walk => walk.name)).toEqual([
    "FT-RTR: Castle district",
  ]);
});

it("matches the loop-of-europe leg codes case-insensitively and numbers each leg", () => {
  expect(
    selectedNames("loop-of-europe", [
      "FT-RTR-1: Hairdryer",
      "FT-gtc-2: Lower case",
      "FT-RTR: Some walk",
      "FT-VTG: To CERN",
    ]),
  ).toEqual(["FT-RTR-1: Hairdryer", "FT-gtc-2: Lower case"]);
});

it("accepts the shorter PREFIX-N day naming alongside the older Day N naming", () => {
  expect(
    selectedNames("tokyo-to-seoul", ["TTS-1: Build the bike", "TTS-14", "TTS Day 15: Old style", "TTS-0: Nope"]),
  ).toEqual(["TTS-1: Build the bike", "TTS-14", "TTS Day 15: Old style"]);
  expect(selectedNames("belfast-rotterdam-2023", ["BTR-1", "RTB-4: Home", "BTR: Day 2", "BTR2-1"])).toEqual([
    "BTR-1",
    "RTB-4: Home",
    "BTR: Day 2",
  ]);
  expect(selectedNames("belfast-rotterdam-2024", ["BTR2-1", "RTB2-3: Gravel", "BTR-1"])).toEqual([
    "BTR2-1",
    "RTB2-3: Gravel",
  ]);
  expect(selectedNames("rotterdam-to-rotterdam", ["RTR-2: Heat", "FT-RTR-2: Other trip"])).toEqual(["RTR-2: Heat"]);
  expect(selectedNames("porto-to-faro", ["PTF-3: Lisbon side", "PTF-Lisbon side quest"])).toEqual([
    "PTF-3: Lisbon side",
  ]);
});

it("finds outings under the shorter naming and keeps the reversed RTR-FT typo out of the RTR trip", () => {
  const walks = [
    activity("RTR-Antwerping", {sport_type: "Walk", distance: 15_000}),
    activity("BTR-Walk", {sport_type: "Walk", distance: 15_000}),
    activity("BTR2-Walk", {sport_type: "Walk", distance: 15_000}),
    activity("RTR-FT: Real Austrian food", {sport_type: "Walk", distance: 15_000}),
  ];

  expect(selectTripOutings(walks, sourceFor("rotterdam-to-rotterdam")).map(walk => walk.name)).toEqual([
    "RTR-Antwerping",
  ]);
  expect(selectTripOutings(walks, sourceFor("belfast-rotterdam-2023")).map(walk => walk.name)).toEqual(["BTR-Walk"]);
  expect(selectTripOutings(walks, sourceFor("belfast-rotterdam-2024")).map(walk => walk.name)).toEqual(["BTR2-Walk"]);
});

it("selects unnumbered FT rides as bonus rides but never numbered days or walks", () => {
  const rides = [
    activity("FT-VTG-1: Up", {id: 1}),
    activity("FT-VTG: To CERN", {id: 2}),
    activity("FT-VTG: A walk", {id: 3, sport_type: "Walk"}),
    activity("FT-BTV: Wee city bike", {id: 4, start_date_local: "2026-07-01T09:00:00Z"}),
    activity("Unrelated ride", {id: 5}),
  ];

  expect(selectTripBonusRides(rides, sourceFor("loop-of-europe")).map(ride => ride.id)).toEqual([2, 4]);
});

it("selects bonus rides for other trips by explicit activity id only", () => {
  const rides = [
    activity("BTR2: Headwinds again", {id: 12_358_292_078}),
    activity("BTR2: Very relaxed ride to the ferry", {id: 12_314_436_990}),
    activity("Would be a shame naught to", {id: 9_756_461_976}),
    activity("PTF: Porto bike and weather test", {id: 11_369_434_972}),
    activity("PTF: Lisbon trip to the bike shop for a thruaxle spare", {id: 11_401_534_948}),
    activity("PTF: Lisbon side quest", {id: 11_408_894_321}),
  ];

  expect(selectTripBonusRides(rides, sourceFor("belfast-rotterdam-2024")).map(ride => ride.id)).toEqual([
    12_358_292_078, 12_314_436_990,
  ]);
  expect(selectTripBonusRides(rides, sourceFor("belfast-rotterdam-2023")).map(ride => ride.id)).toEqual([
    9_756_461_976,
  ]);
  expect(selectTripBonusRides(rides, sourceFor("porto-to-faro")).map(ride => ride.id)).toEqual([
    11_369_434_972, 11_408_894_321,
  ]);
  expect(selectTripBonusRides(rides, sourceFor("tokyo-to-seoul"))).toEqual([]);
});
