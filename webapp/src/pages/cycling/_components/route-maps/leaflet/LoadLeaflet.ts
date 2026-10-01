import leafletStylesheetUrl from "leaflet/dist/leaflet.css?url";

import type {LeafletModule} from "./types/LeafletModule";

type OptionalLeafletRequest = Promise<LeafletModule> | undefined;

let leafletRequest: OptionalLeafletRequest;

export function loadLeaflet(): Promise<LeafletModule> {
  if (leafletRequest !== undefined) {
    return leafletRequest;
  }

  leafletRequest = Promise.all([import("leaflet"), loadLeafletStylesheet()]).then(([leaflet]) => leaflet);
  return leafletRequest;
}

// A dynamic `import("leaflet/dist/leaflet.css")` is hoisted by Astro into every page's <head> as a render-blocking
// link, so the stylesheet is requested by URL here, only once a map is actually about to render.
function loadLeafletStylesheet(): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = leafletStylesheetUrl;
    link.addEventListener("load", () => resolve(), {once: true});
    link.addEventListener("error", () => reject(new Error("Leaflet stylesheet failed to load.")), {once: true});
    document.head.append(link);
  });
}
