import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import type {TripMapRouteKind} from "@src/pages/cycling/_components/trip-route-map/types/TripMapRouteKind";
import type {LeafletModule} from "./types/LeafletModule";
import type {StyledRouteLayer} from "./types/StyledRouteLayer";
import type {Map as LeafletMap, PathOptions} from "leaflet";

interface AddStyledRouteLineOptions {
  kind: TripMapRouteKind;
  leaflet: LeafletModule;
  map: LeafletMap;
  pathOptions: PathOptions;
  points: readonly PolylinePoint[];
}

export function addStyledRouteLine(options: AddStyledRouteLineOptions): StyledRouteLayer {
  const {kind, leaflet, map, pathOptions, points} = options;
  const layer = leaflet.polyline([...points], pathOptions).addTo(map);
  return {
    baseOpacity: pathOptions.opacity ?? 1,
    baseWeight: pathOptions.weight ?? 3,
    kind,
    layer,
  };
}
