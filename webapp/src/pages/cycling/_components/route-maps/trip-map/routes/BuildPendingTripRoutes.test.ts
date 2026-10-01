import {expect, it} from "vitest";

import type {TripRouteMapManifest} from "@src/content/trip/route-map/types/TripRouteMapManifest";
import {PolylineCodec} from "@src/content/trip/strava/routes/PolylineCodec";
import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import {buildPendingTripRoutes} from "./BuildPendingTripRoutes";
import type {TripRouteMetadata} from "@src/pages/cycling/_components/route-maps/trip-map/types/TripRouteMetadata";

it("omits activity metadata without published route geometry", () => {
  const metadata: TripRouteMetadata[] = [routeMetadata("1")];
  const manifest: TripRouteMapManifest = {
    ferries: [],
    routes: {},
    transitGaps: [],
    transitRoutes: [],
  };

  expect(buildPendingTripRoutes(metadata, manifest)).toEqual([]);
});

it("preserves activity order while attaching reviewed and explicit transit routes", () => {
  const points: PolylinePoint[] = [
    [0, 0],
    [0, 0.001],
    [0, 0.02],
    [0, 0.021],
  ];
  const explicitTransit: PolylinePoint[] = [
    [1, 1],
    [1, 2],
  ];
  const metadata: TripRouteMetadata[] = [routeMetadata("1")];
  const manifest: TripRouteMapManifest = {
    ferries: [],
    routes: {"1": PolylineCodec.encode(points)},
    transitGaps: [{activityId: 1, minimumGapMetres: 1_000}],
    transitRoutes: [
      {
        activityId: 1,
        id: "train-return",
        name: "Train return",
        points: explicitTransit,
        sourceUrl: "https://example.com/train",
      },
    ],
  };

  expect(buildPendingTripRoutes(metadata, manifest)).toEqual([
    {
      metadata: metadata[0],
      pointGroups: [
        {points: [points[0], points[1]]},
        {kind: "transit", points: [points[1], points[2]]},
        {points: [points[2], points[3]]},
        {kind: "transit", points: explicitTransit},
      ],
    },
  ]);
});

it("removes a declared ferry chord and adds the ferry as its own selectable route", () => {
  const points: PolylinePoint[] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ];
  const ferryPoints: PolylinePoint[] = [points[1]!, points[2]!];
  const metadata: TripRouteMetadata[] = [routeMetadata("2")];
  const manifest: TripRouteMapManifest = {
    ferries: [
      {
        activityId: 2,
        id: "harbour-crossing",
        name: "Harbour crossing",
        points: ferryPoints,
        sourceUrl: "https://example.com/ferry",
      },
    ],
    routes: {"2": PolylineCodec.encode(points)},
    transitGaps: [],
    transitRoutes: [],
  };

  expect(buildPendingTripRoutes(metadata, manifest)).toEqual([
    {
      metadata: metadata[0],
      pointGroups: [{points: [points[0], points[1]]}, {points: [points[2], points[3]]}],
    },
    {
      metadata: {
        finish: false,
        id: "harbour-crossing",
        kind: "ferry",
        selectionLabel: "Ferry · Harbour crossing",
        start: false,
      },
      pointGroups: [{points: ferryPoints}],
    },
  ]);
});

function routeMetadata(id: string): TripRouteMetadata {
  return {
    colourIndex: 0,
    finish: false,
    id,
    kind: "ride",
    selectionLabel: `Day ${id}`,
    start: false,
  };
}
