import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import type {TripRouteSegment} from "./types/TripRouteSegment.ts";

const EARTH_RADIUS_METRES = 6_371_000;

export function splitRouteAtTransitGaps(
  points: readonly PolylinePoint[],
  minimumGapMetres: number,
): TripRouteSegment[] {
  const firstPoint = points[0];

  if (firstPoint === undefined) {
    return [];
  }

  const segments: TripRouteSegment[] = [];
  let recordedPoints: PolylinePoint[] = [firstPoint];

  for (let index = 1; index < points.length; index += 1) {
    const previousPoint = points[index - 1];
    const point = points[index];

    if (previousPoint === undefined || point === undefined) {
      continue;
    }

    if (distanceMetres(previousPoint, point) >= minimumGapMetres) {
      addRecordedSegment(segments, recordedPoints);
      segments.push({kind: "transit", points: [previousPoint, point]});
      recordedPoints = [point];
      continue;
    }

    recordedPoints.push(point);
  }

  addRecordedSegment(segments, recordedPoints);
  return segments;
}

function distanceMetres(first: PolylinePoint, second: PolylinePoint): number {
  const latitudeDistance = radians(second[0] - first[0]);
  const longitudeDistance = radians(second[1] - first[1]);
  const firstLatitude = radians(first[0]);
  const secondLatitude = radians(second[0]);
  const haversine =
    Math.sin(latitudeDistance / 2) ** 2 +
    Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDistance / 2) ** 2;
  return 2 * EARTH_RADIUS_METRES * Math.asin(Math.sqrt(haversine));
}

function radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function addRecordedSegment(segments: TripRouteSegment[], points: readonly PolylinePoint[]): void {
  if (points.length >= 2) {
    segments.push({kind: "recorded", points: [...points]});
  }
}
