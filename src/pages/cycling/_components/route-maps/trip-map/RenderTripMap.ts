import {routeMapFullscreenController} from "@src/pages/cycling/_components/route-maps/fullscreen/RouteMapFullscreenController";
import {addRouteMapTiles} from "@src/pages/cycling/_components/route-maps/leaflet/AddRouteMapTiles";
import {createRouteMap} from "@src/pages/cycling/_components/route-maps/leaflet/CreateRouteMap";
import {loadLeaflet} from "@src/pages/cycling/_components/route-maps/leaflet/LoadLeaflet";
import {loadRouteManifest} from "@src/pages/cycling/_components/route-maps/route-manifest/LoadRouteManifest";
import {fitTripMapBounds} from "@src/pages/cycling/_components/route-maps/trip-map/bounds/FitTripMapBounds";
import {addTripMapMarkers} from "@src/pages/cycling/_components/route-maps/trip-map/markers/AddTripMapMarkers";
import {readHighlightedRouteIds} from "@src/pages/cycling/_components/route-maps/trip-map/metadata/ReadHighlightedRouteIds";
import {readTripRouteMetadata} from "@src/pages/cycling/_components/route-maps/trip-map/metadata/ReadTripRouteMetadata";
import {renderTripRoutes} from "@src/pages/cycling/_components/route-maps/trip-map/rendering/RenderTripRoutes";
import {buildPendingTripRoutes} from "@src/pages/cycling/_components/route-maps/trip-map/routes/BuildPendingTripRoutes";
import {initialiseTripRouteSelection} from "@src/pages/cycling/_components/route-maps/trip-map/selection/InitialiseTripRouteSelection";
import type {LatLngBounds} from "leaflet";

export async function renderTripMap(container: HTMLElement, routesUrl: string): Promise<void> {
  if (routesUrl === "" || container.dataset.mapInitialised === "true") {
    return;
  }

  container.dataset.mapInitialised = "true";
  const shell = container.closest<HTMLElement>("[data-trip-route-map-shell]");

  if (shell === null) {
    throw new Error("Trip route map has no shell.");
  }

  const [leaflet, routes] = await Promise.all([loadLeaflet(), loadRouteManifest(routesUrl)]);
  const metadata = readTripRouteMetadata(shell);
  const pendingRoutes = buildPendingTripRoutes(metadata, routes);

  if (pendingRoutes.length === 0) {
    throw new Error("Trip route map has no renderable routes.");
  }

  const detail = shell.dataset.mapVariant === "detail";
  const map = createRouteMap(leaflet, container, {interactive: detail, overview: true});
  const renderedRoutes = renderTripRoutes({detail, leaflet, map, routes: pendingRoutes});
  const allBounds = leaflet
    .featureGroup(renderedRoutes.flatMap(route => route.layers.map(({layer}) => layer)))
    .getBounds();
  const ferryTerminalMarkers = addTripMapMarkers({leaflet, map, routes: pendingRoutes});
  addRouteMapTiles(leaflet, map);

  const highlightedRouteIds = readHighlightedRouteIds(shell);
  let highlightedBounds: LatLngBounds | undefined;

  if (highlightedRouteIds !== undefined) {
    const highlightedLayers = renderedRoutes
      .filter(route => highlightedRouteIds.has(route.metadata.id))
      .flatMap(route => route.layers.map(({layer}) => layer));

    if (highlightedLayers.length > 0) {
      highlightedBounds = leaflet.featureGroup(highlightedLayers).getBounds();
    }
  }

  if (detail) {
    map.zoomControl.setPosition("bottomleft");
    initialiseTripRouteSelection({
      allBounds,
      ferryTerminalMarkers,
      map,
      routes: renderedRoutes,
      shell,
      highlightedRouteIds,
      highlightedBounds,
    });
    routeMapFullscreenController.register(container, map, {synchroniseInteraction: false});
  }

  let padding = 12;

  if (detail) {
    padding = 32;
  }

  const fitBounds = highlightedBounds ?? allBounds;

  container.classList.remove("invisible");
  shell.dataset.mapState = "ready";
  hideElement(shell.querySelector<HTMLElement>("[data-trip-route-map-status]"));
  showElement(shell.querySelector<HTMLElement>("[data-trip-route-map-controls]"));
  showElement(shell.querySelector<HTMLElement>("[data-trip-route-attribution]"));
  fitTripMapBounds({bounds: fitBounds, map, padding, shell});
}

function hideElement(element: HTMLElement | null): void {
  if (element !== null) {
    element.hidden = true;
  }
}

function showElement(element: HTMLElement | null): void {
  if (element !== null) {
    element.hidden = false;
  }
}
