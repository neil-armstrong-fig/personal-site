import {expect, it} from "vitest";

import {getTripSnapshot} from "@src/content/trip/strava/snapshot/GetTripSnapshot";
import {getTripTransitGaps} from "./GetTripTransitGaps";
import type {TripTransitGap} from "./types/TripTransitGap";

it("limits reviewed transit-gap rules to mapped trip activities", () => {
  const tokyoTransitGaps = expectMappedTransitGaps("tokyo-to-seoul", 11);
  const loopTransitGaps = expectMappedTransitGaps("loop-of-europe", 1);

  expect(tokyoTransitGaps).toContainEqual({activityId: 14056840372, minimumGapMetres: 6_000});
  expect(tokyoTransitGaps).toContainEqual({activityId: 14220657924, minimumGapMetres: 5_000});
  expect(loopTransitGaps).toContainEqual({activityId: 19810014720, minimumGapMetres: 1_000});
  expect(getTripTransitGaps("porto-to-faro")).toEqual([]);
});

function expectMappedTransitGaps(tripId: string, expectedCount: number): readonly TripTransitGap[] {
  const transitGaps = getTripTransitGaps(tripId);
  const snapshot = getTripSnapshot(tripId);
  const mappedActivityIds = new Set([
    ...(snapshot?.days.map(day => day.id) ?? []),
    ...(snapshot?.outings.map(outing => outing.id) ?? []),
  ]);

  expect(transitGaps).toHaveLength(expectedCount);

  for (const transitGap of transitGaps) {
    expect(mappedActivityIds.has(transitGap.activityId)).toBe(true);
    expect(transitGap.minimumGapMetres).toBeGreaterThanOrEqual(1_000);
  }

  return transitGaps;
}
