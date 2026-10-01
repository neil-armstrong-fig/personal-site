import type {TripMapRouteKind} from "@src/pages/cycling/_components/trip-route-map/types/TripMapRouteKind";

interface TripRouteVisibilityOptions {
  ferriesVisible: boolean;
  kind: TripMapRouteKind;
  outingsVisible: boolean;
  transitVisible: boolean;
}

export function isTripRouteLayerVisible(options: TripRouteVisibilityOptions): boolean {
  if (options.kind === "walk" || options.kind === "hike") {
    return options.outingsVisible;
  }

  if (options.kind === "transit") {
    return options.transitVisible;
  }

  if (options.kind === "ferry") {
    return options.ferriesVisible;
  }

  return true;
}
