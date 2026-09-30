import type {TripFerryRoute} from "@src/content/trip/ferries/types/TripFerryRoute";
import type {TripRouteManifest} from "@src/content/trip/strava/routes/types/TripRouteManifest";
import type {TripTransitGap} from "@src/content/trip/transit-gaps/types/TripTransitGap";
import type {TripTransitRoute} from "@src/content/trip/transit-routes/types/TripTransitRoute";

export interface TripRouteMapManifest extends TripRouteManifest {
  ferries: TripFerryRoute[];
  transitGaps: TripTransitGap[];
  transitRoutes: TripTransitRoute[];
}
