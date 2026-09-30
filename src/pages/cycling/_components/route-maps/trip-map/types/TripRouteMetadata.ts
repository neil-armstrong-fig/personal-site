import type {TripMapRouteKind} from "@src/pages/cycling/_components/trip-route-map/types/TripMapRouteKind";

export interface TripRouteMetadata {
  id: string;
  kind: TripMapRouteKind;
  colourIndex?: number;
  start: boolean;
  finish: boolean;
  selectionLabel: string;
}
