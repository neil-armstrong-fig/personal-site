import {expect, it} from "vitest";

import type {TripFerryRoute} from "@src/content/trip/ferries/types/TripFerryRoute";
import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import {splitRouteAtFerries} from "./SplitRouteAtFerries";

interface TestFerryOptions {
  id: string;
  activityId: number;
  departure: PolylinePoint | undefined;
  arrival: PolylinePoint | undefined;
}

it("replaces a declared straight ferry chord with two cycling segments", () => {
  const points: PolylinePoint[] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ];

  expect(
    splitRouteAtFerries(points, 1, [ferry({id: "crossing", activityId: 1, departure: points[1], arrival: points[3]})]),
  ).toEqual([
    [
      [0, 0],
      [0, 1],
    ],
    [
      [0, 3],
      [0, 4],
    ],
  ]);
});

it("splits multiple ferries in one activity and ignores crossings belonging to another activity", () => {
  const points: PolylinePoint[] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
  ];
  const ferries = [
    ferry({id: "first", activityId: 2, departure: points[1], arrival: points[2]}),
    ferry({id: "ignored", activityId: 3, departure: points[2], arrival: points[4]}),
    ferry({id: "second", activityId: 2, departure: points[4], arrival: points[5]}),
  ];

  expect(splitRouteAtFerries(points, 2, ferries)).toEqual([
    [
      [0, 0],
      [0, 1],
    ],
    [
      [0, 2],
      [0, 3],
      [0, 4],
    ],
    [
      [0, 5],
      [0, 6],
    ],
  ]);
});

function ferry(options: TestFerryOptions): TripFerryRoute {
  const {id, activityId, departure, arrival} = options;
  if (departure === undefined || arrival === undefined) {
    throw new Error("The test ferry endpoints must exist.");
  }

  return {
    id,
    activityId,
    name: id,
    points: [departure, arrival],
    sourceUrl: "https://example.com/ferry",
  };
}
