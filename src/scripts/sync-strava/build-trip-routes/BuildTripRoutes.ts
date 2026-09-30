import type {StravaActivitySummary} from "@src/scripts/shared/strava/types/StravaActivitySummary";
import type {TripRouteManifest} from "@src/content/trip/strava/routes/types/TripRouteManifest";
import {PolylineCodec} from "@src/content/trip/strava/routes/PolylineCodec.ts";
import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint.ts";

type OptionalActivityId = number | undefined;

interface TripRouteOptions {
  firstActivityId: OptionalActivityId;
  lastActivityId: OptionalActivityId;
  trimBothActivityIds?: readonly number[];
  trimMetres: number;
}

export function buildTripRoutes(
  activities: readonly StravaActivitySummary[],
  options: TripRouteOptions,
): TripRouteManifest {
  const routes: Record<string, string> = {};
  const trimBothActivityIds = new Set(options.trimBothActivityIds ?? []);

  for (const activity of activities) {
    const sourcePolyline = activity.map?.summary_polyline;

    if (sourcePolyline === undefined || sourcePolyline === "") {
      continue;
    }

    let points = PolylineCodec.decode(sourcePolyline);

    if (activity.id === options.firstActivityId || trimBothActivityIds.has(activity.id)) {
      points = trimStart(points, options.trimMetres);
    }

    if (activity.id === options.lastActivityId || trimBothActivityIds.has(activity.id)) {
      points = trimEnd(points, options.trimMetres);
    }

    if (points.length >= 2) {
      routes[String(activity.id)] = PolylineCodec.encode(points);
    }
  }

  return {routes};
}

function trimStart(points: readonly PolylinePoint[], metres: number): PolylinePoint[] {
  let distance = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];

    if (previous === undefined || current === undefined) {
      return [];
    }

    distance += distanceBetween(previous, current);

    if (distance >= metres) {
      return points.slice(index);
    }
  }

  return [];
}

function trimEnd(points: readonly PolylinePoint[], metres: number): PolylinePoint[] {
  let distance = 0;

  for (let index = points.length - 2; index >= 0; index -= 1) {
    const current = points[index];
    const next = points[index + 1];

    if (current === undefined || next === undefined) {
      return [];
    }

    distance += distanceBetween(current, next);

    if (distance >= metres) {
      return points.slice(0, index + 1);
    }
  }

  return [];
}

function distanceBetween(first: PolylinePoint, second: PolylinePoint): number {
  const earthRadiusMetres = 6_371_000;
  const firstLatitude = radians(first[0]);
  const secondLatitude = radians(second[0]);
  const latitudeDelta = secondLatitude - firstLatitude;
  const longitudeDelta = radians(second[1] - first[1]);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusMetres * Math.asin(Math.sqrt(haversine));
}

function radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
