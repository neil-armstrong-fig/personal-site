import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import type {TripMapRouteKind} from "@src/pages/cycling/_components/trip-route-map/types/TripMapRouteKind";

export interface PendingTripRoutePointGroup {
  kind?: TripMapRouteKind;
  points: PolylinePoint[];
}
