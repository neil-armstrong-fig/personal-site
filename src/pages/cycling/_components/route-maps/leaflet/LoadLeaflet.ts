import type {LeafletModule} from "./types/LeafletModule";

type OptionalLeafletRequest = Promise<LeafletModule> | undefined;

let leafletRequest: OptionalLeafletRequest;

export function loadLeaflet(): Promise<LeafletModule> {
  if (leafletRequest !== undefined) {
    return leafletRequest;
  }

  leafletRequest = Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]).then(([leaflet]) => leaflet);
  return leafletRequest;
}
