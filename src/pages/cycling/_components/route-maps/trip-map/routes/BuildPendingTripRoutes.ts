import type {TripRouteMapManifest} from "@src/content/trip/route-map/types/TripRouteMapManifest";
import {PolylineCodec} from "@src/content/trip/strava/routes/PolylineCodec";
import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import type {TripTransitGap} from "@src/content/trip/transit-gaps/types/TripTransitGap";
import {buildRouteSegments} from "@src/pages/cycling/_components/route-maps/route-segments/BuildRouteSegments";
import type {PendingTripRoute} from "@src/pages/cycling/_components/route-maps/trip-map/types/PendingTripRoute";
import type {PendingTripRoutePointGroup} from "@src/pages/cycling/_components/route-maps/trip-map/types/PendingTripRoutePointGroup";
import type {TripRouteMetadata} from "@src/pages/cycling/_components/route-maps/trip-map/types/TripRouteMetadata";
import {splitRouteAtFerries} from "@src/pages/cycling/_components/trip-route-map/ferries/SplitRouteAtFerries";

type OptionalTripTransitGap = TripTransitGap | undefined;

export function buildPendingTripRoutes(
  metadata: readonly TripRouteMetadata[],
  manifest: TripRouteMapManifest,
): PendingTripRoute[] {
  const pendingRoutes: PendingTripRoute[] = [];

  for (const route of metadata) {
    const encodedRoute = manifest.routes[route.id];

    if (encodedRoute === undefined) {
      continue;
    }

    const points = PolylineCodec.decode(encodedRoute);
    const activityId = Number(route.id);
    const transitGap = manifest.transitGaps.find(candidate => candidate.activityId === activityId);
    const pointGroups = splitRouteAtFerries(points, activityId, manifest.ferries).flatMap(pointGroup =>
      pendingPointGroups(pointGroup, transitGap),
    );

    for (const transitRoute of manifest.transitRoutes.filter(candidate => candidate.activityId === activityId)) {
      if (transitRoute.points.length >= 2) {
        pointGroups.push({kind: "transit", points: [...transitRoute.points]});
      }
    }

    if (pointGroups.length > 0) {
      pendingRoutes.push({metadata: route, pointGroups});
    }
  }

  for (const ferry of manifest.ferries) {
    if (ferry.points.length < 2) {
      continue;
    }

    pendingRoutes.push({
      metadata: {
        id: ferry.id,
        kind: "ferry",
        start: false,
        finish: false,
        selectionLabel: `Ferry · ${ferry.name}`,
      },
      pointGroups: [{points: ferry.points}],
    });
  }

  return pendingRoutes;
}

function pendingPointGroups(
  points: readonly PolylinePoint[],
  transitGap: OptionalTripTransitGap,
): PendingTripRoutePointGroup[] {
  return buildRouteSegments(points, transitGap).map(segment => {
    const pointGroup: PendingTripRoutePointGroup = {points: segment.points};

    if (segment.kind === "transit") {
      pointGroup.kind = "transit";
    }

    return pointGroup;
  });
}
