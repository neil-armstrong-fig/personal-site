import {expect, it} from "vitest";

import {PolylineCodec} from "@src/content/trip/strava/routes/PolylineCodec";
import {buildTripRoutes} from "./BuildTripRoutes";
import type {StravaActivitySummary} from "@src/scripts/shared/strava/types/StravaActivitySummary";

function activity(id: number, longitudes: readonly number[]): StravaActivitySummary {
  return {
    id,
    name: `Ride ${id}`,
    sport_type: "Ride",
    start_date_local: "2026-01-01T10:00:00Z",
    distance: 10_000,
    moving_time: 1_000,
    total_elevation_gain: 100,
    visibility: "everyone",
    map: {summary_polyline: PolylineCodec.encode(longitudes.map(longitude => [0, longitude]))},
  };
}

it("trims five kilometres from the trip's first start and final end", () => {
  const route = buildTripRoutes(
    [activity(1, [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12])],
    {
      firstActivityId: 1,
      lastActivityId: 1,
      trimMetres: 5_000,
    },
  ).routes["1"];

  expect(route).toBeDefined();

  const points = PolylineCodec.decode(route ?? "");
  expect(points[0]?.[1]).toBeGreaterThanOrEqual(0.04);
  expect(points.at(-1)?.[1]).toBeLessThanOrEqual(0.08);
});

it("trims both ends of bonus rides without displacing the official trip boundaries", () => {
  const longitudes = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12];
  const routes = buildTripRoutes([activity(2, longitudes), activity(1, longitudes), activity(3, longitudes)], {
    firstActivityId: 1,
    lastActivityId: 3,
    trimBothActivityIds: [2],
    trimMetres: 5_000,
  }).routes;
  const first = PolylineCodec.decode(routes["1"] ?? "");
  const bonus = PolylineCodec.decode(routes["2"] ?? "");
  const last = PolylineCodec.decode(routes["3"] ?? "");

  expect(first[0]?.[1]).toBeGreaterThanOrEqual(0.04);
  expect(first.at(-1)?.[1]).toBe(0.12);
  expect(bonus[0]?.[1]).toBeGreaterThanOrEqual(0.04);
  expect(bonus.at(-1)?.[1]).toBeLessThanOrEqual(0.08);
  expect(last[0]?.[1]).toBe(0);
  expect(last.at(-1)?.[1]).toBeLessThanOrEqual(0.08);
});

it("retains complete intermediate routes and omits missing or fully trimmed routes", () => {
  const intermediate = activity(2, [0, 0.02, 0.04]);
  const tooShort = activity(1, [0, 0.01, 0.02]);
  const withoutMap = {...activity(3, [0, 0.02]), map: undefined};
  const routes = buildTripRoutes([tooShort, intermediate, withoutMap], {
    firstActivityId: 1,
    lastActivityId: 3,
    trimMetres: 5_000,
  }).routes;

  expect(routes["1"]).toBeUndefined();
  expect(routes["2"]).toBe(intermediate.map?.summary_polyline);
  expect(routes["3"]).toBeUndefined();
});
