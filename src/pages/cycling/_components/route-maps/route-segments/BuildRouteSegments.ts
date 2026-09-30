import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import type {TripTransitGap} from "@src/content/trip/transit-gaps/types/TripTransitGap";
import {splitRouteAtTransitGaps} from "@src/pages/cycling/_components/trip-route-map/transit-gaps/SplitRouteAtTransitGaps";
import type {TripRouteSegment} from "@src/pages/cycling/_components/trip-route-map/transit-gaps/types/TripRouteSegment";

type OptionalTripTransitGap = TripTransitGap | undefined;

export function buildRouteSegments(
  points: readonly PolylinePoint[],
  transitGap: OptionalTripTransitGap,
): TripRouteSegment[] {
  if (transitGap === undefined) {
    return [{kind: "recorded", points: [...points]}];
  }

  return splitRouteAtTransitGaps(points, transitGap.minimumGapMetres);
}
