import type {TripFerryRoute} from "@src/content/trip/ferries/types/TripFerryRoute";
import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";

interface FerrySegment {
  departureIndex: number;
  arrivalIndex: number;
}

export function splitRouteAtFerries(
  points: readonly PolylinePoint[],
  activityId: number,
  ferries: readonly TripFerryRoute[],
): PolylinePoint[][] {
  const ferrySegments = ferries
    .filter(ferry => ferry.activityId === activityId)
    .map(ferry => findFerrySegment(points, ferry))
    .filter((segment): segment is FerrySegment => segment !== undefined)
    .sort((first, second) => first.departureIndex - second.departureIndex);

  if (ferrySegments.length === 0) {
    return [[...points]];
  }

  const pointGroups: PolylinePoint[][] = [];
  let startIndex = 0;

  for (const {departureIndex, arrivalIndex} of ferrySegments) {
    if (departureIndex < startIndex || arrivalIndex <= departureIndex) {
      continue;
    }

    addRenderableGroup(pointGroups, points.slice(startIndex, departureIndex + 1));
    startIndex = arrivalIndex;
  }

  addRenderableGroup(pointGroups, points.slice(startIndex));
  return pointGroups;
}

function findFerrySegment(points: readonly PolylinePoint[], ferry: TripFerryRoute): FerrySegment | undefined {
  const departure = ferry.points[0];
  const arrival = ferry.points.at(-1);

  if (departure === undefined || arrival === undefined) {
    return undefined;
  }

  const departureIndex = points.findIndex(point => pointsEqual(point, departure));

  if (departureIndex < 0) {
    return undefined;
  }

  const followingPoints = points.slice(departureIndex + 1);
  const relativeArrivalIndex = followingPoints.findIndex(point => pointsEqual(point, arrival));

  if (relativeArrivalIndex < 0) {
    return undefined;
  }

  return {departureIndex, arrivalIndex: departureIndex + relativeArrivalIndex + 1};
}

function pointsEqual(first: PolylinePoint, second: PolylinePoint): boolean {
  return first[0] === second[0] && first[1] === second[1];
}

function addRenderableGroup(pointGroups: PolylinePoint[][], points: readonly PolylinePoint[]): void {
  if (points.length >= 2) {
    pointGroups.push([...points]);
  }
}
