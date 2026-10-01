import {readRouteMapColours} from "@src/pages/cycling/_components/route-maps/leaflet/ReadRouteMapColours";
import type {LeafletModule} from "@src/pages/cycling/_components/route-maps/leaflet/types/LeafletModule";
import type {PendingTripRoute} from "@src/pages/cycling/_components/route-maps/trip-map/types/PendingTripRoute";
import type {CircleMarker, Map as LeafletMap} from "leaflet";

interface AddTripMapMarkersOptions {
  leaflet: LeafletModule;
  map: LeafletMap;
  routes: readonly PendingTripRoute[];
}

export function addTripMapMarkers(options: AddTripMapMarkersOptions): CircleMarker[] {
  addBoundaryMarkers(options);
  return addFerryTerminalMarkers(options);
}

function addBoundaryMarkers(options: AddTripMapMarkersOptions): void {
  const {leaflet, map, routes} = options;
  const startRoute = routes.find(route => route.metadata.start);
  const finishRoute = routes.find(route => route.metadata.finish);
  const start = startRoute?.pointGroups[0]?.points[0];
  const finish = finishRoute?.pointGroups.at(-1)?.points.at(-1);

  if (start === undefined || finish === undefined) {
    return;
  }

  const colours = readRouteMapColours();
  const startLocation = leaflet.latLng(start);
  const finishLocation = leaflet.latLng(finish);

  if (startLocation.distanceTo(finishLocation) < 100) {
    leaflet
      .circleMarker(startLocation, {
        color: colours.ink,
        fillColor: colours.copper,
        fillOpacity: 1,
        radius: 7,
        weight: 2,
      })
      .bindTooltip("Privacy-trimmed route start and finish")
      .addTo(map);
    return;
  }

  leaflet
    .circleMarker(startLocation, {color: colours.ink, fillColor: colours.paper, fillOpacity: 1, radius: 6, weight: 2})
    .bindTooltip("Privacy-trimmed route start")
    .addTo(map);
  leaflet
    .circleMarker(finishLocation, {color: colours.ink, fillColor: colours.copper, fillOpacity: 1, radius: 6, weight: 2})
    .bindTooltip("Privacy-trimmed route finish")
    .addTo(map);
}

function addFerryTerminalMarkers(options: AddTripMapMarkersOptions): CircleMarker[] {
  const {leaflet, map, routes} = options;
  const colours = readRouteMapColours();
  const markers: CircleMarker[] = [];

  for (const route of routes.filter(candidate => candidate.metadata.kind === "ferry")) {
    const points = route.pointGroups[0]?.points;
    const departure = points?.[0];
    const arrival = points?.at(-1);

    if (departure === undefined || arrival === undefined) {
      continue;
    }

    for (const point of [departure, arrival]) {
      markers.push(
        leaflet
          .circleMarker(point, {
            color: colours.paper,
            fillColor: colours.petrol,
            fillOpacity: 1,
            radius: 4,
            weight: 2,
          })
          .bindTooltip(route.metadata.selectionLabel)
          .addTo(map),
      );
    }
  }

  return markers;
}
