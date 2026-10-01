import {expect, it} from "vitest";

import {calculateDocumentedTotals} from "./DocumentedTotals";
import type {TripSnapshot} from "@src/content/trip/strava/snapshot/types/TripSnapshot";

const snapshot: TripSnapshot = {
  days: [],
  legs: [],
  outings: [],
  totals: {
    days: 3,
    transitionDays: 0,
    bonusRides: 0,
    distanceMetres: 450_500,
    elevationMetres: 3_000,
    movingTimeSeconds: 50_000,
  },
};

it("totals published trips and their documented Strava distance and riding days", () => {
  const trips = [
    {id: "one", data: {draft: false}},
    {id: "two", data: {draft: false}},
  ];

  expect(calculateDocumentedTotals(trips, () => snapshot)).toEqual({
    publishedTrips: 2,
    documentedTrips: 2,
    distanceMetres: 901_000,
    ridingDays: 6,
  });
});

it("excludes drafts from both the trip count and documented totals", () => {
  const trips = [
    {id: "published", data: {draft: false}},
    {id: "draft", data: {draft: true}},
  ];

  expect(calculateDocumentedTotals(trips, () => snapshot)).toEqual({
    publishedTrips: 1,
    documentedTrips: 1,
    distanceMetres: 450_500,
    ridingDays: 3,
  });
});

it("counts a published trip without a snapshot but does not invent documented totals", () => {
  const trips = [
    {id: "documented", data: {draft: false}},
    {id: "missing", data: {draft: false}},
  ];

  expect(
    calculateDocumentedTotals(trips, tripId => {
      if (tripId === "documented") {
        return snapshot;
      }

      return undefined;
    }),
  ).toEqual({
    publishedTrips: 2,
    documentedTrips: 1,
    distanceMetres: 450_500,
    ridingDays: 3,
  });
});
