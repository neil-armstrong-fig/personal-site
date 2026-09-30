import type {StyledRouteLayer} from "@src/pages/cycling/_components/route-maps/leaflet/types/StyledRouteLayer";
import type {LatLngBounds} from "leaflet";
import type {TripRouteMetadata} from "./TripRouteMetadata";

export interface RenderedTripRoute {
  metadata: TripRouteMetadata;
  layers: StyledRouteLayer[];
  bounds: LatLngBounds;
}
