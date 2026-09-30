import {expect, it} from "vitest";

import {getTripRoutes} from "@src/content/trip/strava/routes/GetTripRoutes";
import {PolylineCodec} from "@src/content/trip/strava/routes/PolylineCodec";
import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import {getTripTransitGaps} from "@src/content/trip/transit-gaps/GetTripTransitGaps";
import {splitRouteAtTransitGaps} from "./SplitRouteAtTransitGaps";

interface TransitSegmentExpectation {
  tripId: string;
  activityId: number;
  transitSegmentCount: number;
}

it("separates long recorded jumps from the surrounding walked route", () => {
  const points: PolylinePoint[] = [
    [0, 0],
    [0, 0.001],
    [0, 0.02],
    [0, 0.021],
  ];

  expect(splitRouteAtTransitGaps(points, 1_000)).toEqual([
    {kind: "recorded", points: [points[0], points[1]]},
    {kind: "transit", points: [points[1], points[2]]},
    {kind: "recorded", points: [points[2], points[3]]},
  ]);
});

it("leaves a route without long jumps as one recorded segment", () => {
  const points: PolylinePoint[] = [
    [54, -6],
    [54.001, -6.001],
    [54.002, -6.002],
  ];

  expect(splitRouteAtTransitGaps(points, 1_000)).toEqual([{kind: "recorded", points}]);
});

it("isolates the reviewed transport jumps across trips", () => {
  const expectations: readonly TransitSegmentExpectation[] = [
    {tripId: "tokyo-to-seoul", activityId: 14056840372, transitSegmentCount: 1},
    {tripId: "tokyo-to-seoul", activityId: 14220657924, transitSegmentCount: 1},
    {tripId: "loop-of-europe", activityId: 19810014720, transitSegmentCount: 2},
  ];

  for (const expectation of expectations) {
    const manifest = getTripRoutes(expectation.tripId);
    const transitGaps = getTripTransitGaps(expectation.tripId);
    const encodedRoute = manifest?.routes[String(expectation.activityId)];
    const transitGap = transitGaps.find(candidate => candidate.activityId === expectation.activityId);

    expect(manifest).toBeDefined();
    expect(encodedRoute).toBeDefined();
    expect(transitGap).toBeDefined();

    if (encodedRoute === undefined || transitGap === undefined) {
      continue;
    }

    const segments = splitRouteAtTransitGaps(PolylineCodec.decode(encodedRoute), transitGap.minimumGapMetres);
    expect(segments.filter(segment => segment.kind === "transit")).toHaveLength(expectation.transitSegmentCount);
  }
});
