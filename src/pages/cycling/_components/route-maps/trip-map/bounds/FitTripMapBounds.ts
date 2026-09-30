import {prefersReducedMotion} from "@src/pages/cycling/_components/route-maps/leaflet/PrefersReducedMotion";
import type {LatLngBounds, Map as LeafletMap} from "leaflet";

interface FitTripMapBoundsOptions {
  bounds: LatLngBounds;
  map: LeafletMap;
  padding: number;
  shell: HTMLElement;
}

export function fitTripMapBounds(options: FitTripMapBoundsOptions): void {
  const {bounds, map, padding, shell} = options;
  const controls = shell.querySelector<HTMLElement>("[data-trip-route-map-controls]");
  let topPadding = padding;

  if (controls !== null && !controls.hidden) {
    topPadding += controls.offsetHeight + 12;
  }

  map.fitBounds(bounds, {
    paddingTopLeft: [padding, topPadding],
    paddingBottomRight: [padding, padding],
    animate: !prefersReducedMotion(),
  });
}
