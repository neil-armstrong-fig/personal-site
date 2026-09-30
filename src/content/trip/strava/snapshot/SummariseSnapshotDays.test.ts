import {expect, it} from "vitest";

import {summariseSnapshotDays} from "./SummariseSnapshotDays";
import type {TripSnapshotDay} from "./types/TripSnapshotDay";

const days: TripSnapshotDay[] = [
  {
    id: 1,
    date: "2025-04-01",
    name: "Ride one",
    distanceMetres: 1000,
    elevationMetres: 100,
    movingTimeSeconds: 60,
    public: true,
  },
  {
    id: 2,
    date: "2025-04-02",
    name: "Transition",
    distanceMetres: 500,
    elevationMetres: 10,
    movingTimeSeconds: 30,
    public: true,
    transition: true,
  },
  {
    id: 3,
    date: "2025-04-03",
    name: "Bonus ride",
    distanceMetres: 200,
    elevationMetres: 5,
    movingTimeSeconds: 15,
    public: true,
    bonus: true,
  },
];

it("counts riding days as days that are neither a transition nor a bonus ride", () => {
  const summary = summariseSnapshotDays(days);

  expect(summary.days).toBe(1);
  expect(summary.transitionDays).toBe(1);
  expect(summary.bonusRides).toBe(1);
});

it("sums distance and elevation across every day regardless of kind", () => {
  const summary = summariseSnapshotDays(days);

  expect(summary.distanceMetres).toBe(1700);
  expect(summary.elevationMetres).toBe(115);
});

it("returns zeroed totals for an empty list", () => {
  expect(summariseSnapshotDays([])).toEqual({
    days: 0,
    transitionDays: 0,
    bonusRides: 0,
    distanceMetres: 0,
    elevationMetres: 0,
  });
});
