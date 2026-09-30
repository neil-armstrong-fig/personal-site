import {expect, it} from "vitest";

import type {TripSnapshot} from "@src/content/trip/strava/snapshot/types/TripSnapshot";
import type {TripSnapshotDay} from "@src/content/trip/strava/snapshot/types/TripSnapshotDay";
import type {TripSnapshotOuting} from "@src/content/trip/strava/snapshot/types/TripSnapshotOuting";
import type {TripMapActivity} from "@src/pages/cycling/_components/trip-route-map/types/TripMapActivity";
import type {TripMapActivityKind} from "@src/pages/cycling/_components/trip-route-map/types/TripMapActivityKind";
import {buildTripMapActivities} from "./BuildTripMapActivities";

it("joins mapped cycling activities and outings chronologically with cycling first on a shared date", () => {
  const result = buildTripMapActivities(
    snapshot(
      [
        day(2, "2026-01-02", "Day 2"),
        day(1, "2026-01-01", "Day 1"),
        {...day(4, "2026-01-04", "Bonus"), bonus: true},
        {...day(3, "2026-01-03", "Transition"), transition: true},
      ],
      [outing(6, "2026-01-02", "Evening walk", "walk"), outing(5, "2026-01-03", "Hill hike", "hike")],
    ),
    new Set(["1", "2", "3", "4", "5", "6"]),
  );

  expect(result).toEqual([
    {...activity(1, "2026-01-01", "Day 1", "ride"), colourIndex: 0, start: true},
    {...activity(2, "2026-01-02", "Day 2", "ride"), colourIndex: 1},
    activity(6, "2026-01-02", "Evening walk", "walk"),
    {...activity(3, "2026-01-03", "Transition", "transition"), colourIndex: 2, finish: true},
    activity(5, "2026-01-03", "Hill hike", "hike"),
    {...activity(4, "2026-01-04", "Bonus", "bonus"), colourIndex: 3},
  ]);
});

it("omits activities without routes and places the finish on the last mapped non-bonus ride", () => {
  const result = buildTripMapActivities(
    snapshot([
      {...day(1, "2026-01-01", "Early bonus"), bonus: true},
      day(2, "2026-01-02", "Missing first day"),
      day(3, "2026-01-03", "Mapped day"),
      {...day(4, "2026-01-04", "Late bonus"), bonus: true},
    ]),
    new Set(["1", "3", "4"]),
  );

  expect(result).toEqual([
    {...activity(1, "2026-01-01", "Early bonus", "bonus"), colourIndex: 0},
    {...activity(3, "2026-01-03", "Mapped day", "ride"), colourIndex: 1, start: true, finish: true},
    {...activity(4, "2026-01-04", "Late bonus", "bonus"), colourIndex: 2},
  ]);
});

it("uses bonus rides as visible boundaries when no ordinary or transition ride remains", () => {
  const result = buildTripMapActivities(
    snapshot([
      {...day(1, "2026-01-01", "First bonus"), bonus: true},
      {...day(2, "2026-01-02", "Last bonus"), bonus: true},
    ]),
    new Set(["1", "2"]),
  );

  expect(result[0]).toMatchObject({start: true, finish: false});
  expect(result[1]).toMatchObject({start: false, finish: true});
});

function snapshot(days: TripSnapshotDay[], outings: TripSnapshotOuting[] = []): TripSnapshot {
  return {
    days,
    outings,
    legs: [],
    totals: {
      days: days.length,
      transitionDays: 0,
      bonusRides: 0,
      distanceMetres: 0,
      elevationMetres: 0,
      movingTimeSeconds: 0,
    },
  };
}

function day(id: number, date: string, name: string): TripSnapshotDay {
  return {id, date, name, distanceMetres: 1, elevationMetres: 1, movingTimeSeconds: 1, public: true};
}

function outing(id: number, date: string, name: string, kind: TripSnapshotOuting["kind"]): TripSnapshotOuting {
  return {...day(id, date, name), kind};
}

function activity(id: number, date: string, name: string, kind: TripMapActivityKind): TripMapActivity {
  return {id, date, name, kind, start: false, finish: false};
}
