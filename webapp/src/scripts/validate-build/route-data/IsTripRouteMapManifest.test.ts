import {expect, it} from "vitest";

import type {TripRouteMapManifest} from "@src/content/trip/route-map/types/TripRouteMapManifest";
import {isTripRouteMapManifest} from "./IsTripRouteMapManifest";

it("accepts a complete route-map manifest", () => {
  expect(isTripRouteMapManifest(validManifest())).toBe(true);
});

it("rejects invalid encoded routes and ferry geometry", () => {
  const manifest = validManifest();

  expect(isTripRouteMapManifest({...manifest, routes: {"1": 42}})).toBe(false);
  expect(
    isTripRouteMapManifest({
      ...manifest,
      ferries: [
        {
          ...manifest.ferries[0],
          points: [
            [91, 0],
            [55, -5],
          ],
        },
      ],
    }),
  ).toBe(false);
});

it("rejects unreviewed transit thresholds and invalid explicit transit sources", () => {
  const manifest = validManifest();

  expect(isTripRouteMapManifest({...manifest, transitGaps: [{activityId: 1, minimumGapMetres: 999}]})).toBe(false);
  expect(
    isTripRouteMapManifest({
      ...manifest,
      transitRoutes: [{...manifest.transitRoutes[0], sourceUrl: "http://example.com/train"}],
    }),
  ).toBe(false);
});

function validManifest(): TripRouteMapManifest {
  return {
    ferries: [
      {
        activityId: 1,
        id: "harbour-crossing",
        name: "Harbour crossing",
        points: [
          [54, -6],
          [55, -5],
        ],
        sourceUrl: "https://example.com/ferry",
      },
    ],
    routes: {"1": "encoded-route"},
    transitGaps: [{activityId: 1, minimumGapMetres: 1_000}],
    transitRoutes: [
      {
        activityId: 1,
        id: "train-return",
        name: "Train return",
        points: [
          [55, -5],
          [54, -6],
        ],
        sourceUrl: "https://example.com/train",
      },
    ],
  };
}
