import type {LeafletModule} from "./types/LeafletModule";
import type {Map as LeafletMap, TileLayer} from "leaflet";

export function addRouteMapTiles(leaflet: LeafletModule, map: LeafletMap): TileLayer {
  return leaflet
    .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    })
    .addTo(map);
}
