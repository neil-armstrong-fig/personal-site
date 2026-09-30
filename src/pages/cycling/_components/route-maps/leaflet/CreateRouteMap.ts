import {prefersReducedMotion} from "./PrefersReducedMotion";
import type {LeafletModule} from "./types/LeafletModule";
import type {Map as LeafletMap} from "leaflet";

interface CreateRouteMapOptions {
  interactive: boolean;
  overview: boolean;
}

export function createRouteMap(
  leaflet: LeafletModule,
  container: HTMLElement,
  options: CreateRouteMapOptions,
): LeafletMap {
  const reducedMotion = prefersReducedMotion();
  return leaflet.map(container, {
    attributionControl: !options.overview,
    boxZoom: options.interactive,
    doubleClickZoom: options.interactive,
    dragging: options.interactive,
    fadeAnimation: !reducedMotion,
    keyboard: options.interactive,
    markerZoomAnimation: !reducedMotion,
    preferCanvas: options.overview,
    scrollWheelZoom: false,
    touchZoom: options.interactive,
    zoomAnimation: !reducedMotion,
    zoomControl: options.interactive,
  });
}
