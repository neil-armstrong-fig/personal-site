import type {TripFerryRoute} from "@src/content/trip/ferries/types/TripFerryRoute";
import {PolylineCodec} from "@src/content/trip/strava/routes/PolylineCodec";
import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import {routeMapFullscreenController} from "@src/pages/cycling/_components/route-maps/fullscreen/RouteMapFullscreenController";
import {addRouteMapTiles} from "@src/pages/cycling/_components/route-maps/leaflet/AddRouteMapTiles";
import {addStyledRouteLine} from "@src/pages/cycling/_components/route-maps/leaflet/AddStyledRouteLine";
import {createRouteMap} from "@src/pages/cycling/_components/route-maps/leaflet/CreateRouteMap";
import {loadLeaflet} from "@src/pages/cycling/_components/route-maps/leaflet/LoadLeaflet";
import {prefersReducedMotion} from "@src/pages/cycling/_components/route-maps/leaflet/PrefersReducedMotion";
import {readRouteMapColours} from "@src/pages/cycling/_components/route-maps/leaflet/ReadRouteMapColours";
import type {LeafletModule} from "@src/pages/cycling/_components/route-maps/leaflet/types/LeafletModule";
import type {RouteMapColours} from "@src/pages/cycling/_components/route-maps/leaflet/types/RouteMapColours";
import type {StyledRouteLayer} from "@src/pages/cycling/_components/route-maps/leaflet/types/StyledRouteLayer";
import {loadRouteManifest} from "@src/pages/cycling/_components/route-maps/route-manifest/LoadRouteManifest";
import {buildRouteSegments} from "@src/pages/cycling/_components/route-maps/route-segments/BuildRouteSegments";
import {initialiseRouteVisibilityToggles} from "@src/pages/cycling/_components/route-maps/visibility/InitialiseRouteVisibilityToggles";
import type {RouteVisibilityState} from "@src/pages/cycling/_components/route-maps/visibility/types/RouteVisibilityState";
import {splitRouteAtFerries} from "@src/pages/cycling/_components/trip-route-map/ferries/SplitRouteAtFerries";
import type {TripMapRouteKind} from "@src/pages/cycling/_components/trip-route-map/types/TripMapRouteKind";
import {isTripRouteLayerVisible} from "@src/pages/cycling/_components/trip-route-map/visibility/TripRouteVisibility";
import type {LatLngBounds, Map as LeafletMap} from "leaflet";

interface ActivityFerryOptions {
  colours: RouteMapColours;
  ferry: TripFerryRoute;
  leaflet: LeafletModule;
  map: LeafletMap;
}

interface ActivityTransitOptions {
  colours: RouteMapColours;
  leaflet: LeafletModule;
  map: LeafletMap;
  points: readonly PolylinePoint[];
  tooltip: string;
}

interface IndicativeActivityRouteOptions {
  colours: RouteMapColours;
  kind: TripMapRouteKind;
  leaflet: LeafletModule;
  map: LeafletMap;
  points: readonly PolylinePoint[];
}

interface ActivityMapState extends RouteVisibilityState {
  layers: StyledRouteLayer[];
}

const activityMapKinds = ["ride", "walk", "hike"] as const;
type ActivityMapKind = (typeof activityMapKinds)[number];
type OptionalDatasetValue = string | undefined;

export async function renderActivityMap(container: HTMLElement, routesUrl: string): Promise<void> {
  const activityId = container.dataset.activityId;
  const activityKind = container.dataset.activityKind;

  if (
    activityId === undefined ||
    !isActivityMapKind(activityKind) ||
    routesUrl === "" ||
    container.dataset.mapInitialised === "true"
  ) {
    return;
  }

  container.dataset.mapInitialised = "true";
  const [leaflet, routes] = await Promise.all([loadLeaflet(), loadRouteManifest(routesUrl)]);
  const encodedRoute = routes.routes[activityId];

  if (encodedRoute === undefined) {
    throw new Error(`No route exists for activity ${activityId}.`);
  }

  const map = createRouteMap(leaflet, container, {interactive: true, overview: false});
  const points = PolylineCodec.decode(encodedRoute);
  const colours = readRouteMapColours();
  const activityIdNumber = Number(activityId);
  const pointGroups = splitRouteAtFerries(points, activityIdNumber, routes.ferries);
  const transitGap = routes.transitGaps.find(candidate => candidate.activityId === activityIdNumber);
  const layers: StyledRouteLayer[] = [];

  for (const pointGroup of pointGroups) {
    for (const segment of buildRouteSegments(pointGroup, transitGap)) {
      if (segment.kind === "transit") {
        layers.push(
          ...addActivityTransit({
            colours,
            leaflet,
            map,
            points: segment.points,
            tooltip: "Recorded transit link",
          }),
        );
        continue;
      }

      layers.push(
        addStyledRouteLine({
          kind: activityKind,
          leaflet,
          map,
          pathOptions: {color: colours.copper, opacity: 0.9, weight: 4},
          points: segment.points,
        }),
      );
    }
  }

  for (const ferry of routes.ferries.filter(candidate => candidate.activityId === activityIdNumber)) {
    layers.push(...addActivityFerry({colours, ferry, leaflet, map}));
  }

  for (const transitRoute of routes.transitRoutes.filter(candidate => candidate.activityId === activityIdNumber)) {
    layers.push(
      ...addActivityTransit({
        colours,
        leaflet,
        map,
        points: transitRoute.points,
        tooltip: `Transit: ${transitRoute.name}`,
      }),
    );
  }

  if (layers.length === 0) {
    throw new Error(`No renderable route exists for activity ${activityId}.`);
  }

  const shell = container.closest<HTMLElement>("[data-activity-route-map-shell]");

  if (shell === null) {
    throw new Error(`Activity ${activityId} route map has no shell.`);
  }

  const state: ActivityMapState = {
    ferriesVisible: true,
    layers,
    outingsVisible: true,
    transitVisible: true,
  };
  initialiseRouteVisibilityToggles(shell, state, () => {
    applyActivityRouteLayerStyles(state);
  });
  addRouteMapTiles(leaflet, map);
  routeMapFullscreenController.register(container, map, {synchroniseInteraction: true});
  fitBounds(map, leaflet.featureGroup(layers.map(({layer}) => layer)).getBounds(), 12);
}

function isActivityMapKind(value: OptionalDatasetValue): value is ActivityMapKind {
  return activityMapKinds.some(activityMapKind => activityMapKind === value);
}

function addActivityFerry(options: ActivityFerryOptions): StyledRouteLayer[] {
  const {colours, ferry, leaflet, map} = options;
  const lines = addIndicativeActivityRoute({colours, kind: "ferry", leaflet, map, points: ferry.points});
  lines.at(-1)?.layer.bindTooltip(`Ferry: ${ferry.name}`);
  return lines;
}

function addActivityTransit(options: ActivityTransitOptions): StyledRouteLayer[] {
  const {colours, leaflet, map, points} = options;
  const lines = addIndicativeActivityRoute({colours, kind: "transit", leaflet, map, points});
  lines.at(-1)?.layer.bindTooltip(options.tooltip);
  return lines;
}

function addIndicativeActivityRoute(options: IndicativeActivityRouteOptions): StyledRouteLayer[] {
  const {colours, kind, leaflet, map, points} = options;
  return [
    addStyledRouteLine({
      kind,
      leaflet,
      map,
      pathOptions: {color: colours.paper, lineCap: "round", opacity: 0.95, weight: 8},
      points,
    }),
    addStyledRouteLine({
      kind,
      leaflet,
      map,
      pathOptions: {
        color: colours.petrol,
        dashArray: "3 9",
        lineCap: "round",
        opacity: 1,
        weight: 4,
      },
      points,
    }),
  ];
}

function applyActivityRouteLayerStyles(state: ActivityMapState): void {
  for (const styledLayer of state.layers) {
    const visible = isTripRouteLayerVisible({
      ferriesVisible: state.ferriesVisible,
      kind: styledLayer.kind,
      outingsVisible: state.outingsVisible,
      transitVisible: state.transitVisible,
    });
    let opacity = 0;
    let weight = 0;

    if (visible) {
      opacity = styledLayer.baseOpacity;
      weight = styledLayer.baseWeight;
    }

    styledLayer.layer.setStyle({interactive: visible, opacity, weight});
  }
}

function fitBounds(map: LeafletMap, bounds: LatLngBounds, padding: number): void {
  map.fitBounds(bounds, {padding: [padding, padding], animate: !prefersReducedMotion()});
}
