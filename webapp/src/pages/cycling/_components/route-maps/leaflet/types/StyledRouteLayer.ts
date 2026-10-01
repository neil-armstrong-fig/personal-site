import type {TripMapRouteKind} from "@src/pages/cycling/_components/trip-route-map/types/TripMapRouteKind";
import type {Polyline} from "leaflet";

export interface StyledRouteLayer {
  layer: Polyline;
  baseOpacity: number;
  baseWeight: number;
  kind: TripMapRouteKind;
}
