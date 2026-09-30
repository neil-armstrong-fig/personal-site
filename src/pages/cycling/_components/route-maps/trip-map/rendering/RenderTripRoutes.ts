import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";
import {addStyledRouteLine} from "@src/pages/cycling/_components/route-maps/leaflet/AddStyledRouteLine";
import {readRouteMapColours} from "@src/pages/cycling/_components/route-maps/leaflet/ReadRouteMapColours";
import type {LeafletModule} from "@src/pages/cycling/_components/route-maps/leaflet/types/LeafletModule";
import type {RouteMapColours} from "@src/pages/cycling/_components/route-maps/leaflet/types/RouteMapColours";
import type {StyledRouteLayer} from "@src/pages/cycling/_components/route-maps/leaflet/types/StyledRouteLayer";
import type {PendingTripRoute} from "@src/pages/cycling/_components/route-maps/trip-map/types/PendingTripRoute";
import type {RenderedTripRoute} from "@src/pages/cycling/_components/route-maps/trip-map/types/RenderedTripRoute";
import type {TripRouteMetadata} from "@src/pages/cycling/_components/route-maps/trip-map/types/TripRouteMetadata";
import {tripRouteColour} from "@src/pages/cycling/_components/trip-route-map/colours/TripRouteColour";
import type {Map as LeafletMap, PathOptions} from "leaflet";
import {orderPointGroupsForRendering} from "./point-groups/OrderPointGroupsForRendering";

interface RenderTripRoutesOptions {
  detail: boolean;
  leaflet: LeafletModule;
  map: LeafletMap;
  routes: readonly PendingTripRoute[];
}

interface TripRouteGroupOptions {
  casingWeight: number;
  colours: RouteMapColours;
  detail: boolean;
  leaflet: LeafletModule;
  map: LeafletMap;
  metadata: TripRouteMetadata;
  normalWeight: number;
  points: readonly PolylinePoint[];
}

export function renderTripRoutes(options: RenderTripRoutesOptions): RenderedTripRoute[] {
  const {detail, leaflet, map, routes} = options;
  const colours = readRouteMapColours();
  const renderedRoutes: RenderedTripRoute[] = [];
  let normalWeight = 3;
  let casingWeight = 5;

  if (detail) {
    normalWeight = 4;
    casingWeight = 7;
  }

  for (const route of routes) {
    const layers: StyledRouteLayer[] = [];

    for (const pointGroup of orderPointGroupsForRendering(route.pointGroups)) {
      let metadata = route.metadata;

      if (pointGroup.kind !== undefined) {
        metadata = {...route.metadata, kind: pointGroup.kind};
      }

      layers.push(
        ...renderTripRouteGroup({
          casingWeight,
          colours,
          detail,
          leaflet,
          map,
          metadata,
          normalWeight,
          points: pointGroup.points,
        }),
      );
    }

    const bounds = leaflet.featureGroup(layers.map(({layer}) => layer)).getBounds();
    renderedRoutes.push({metadata: route.metadata, layers, bounds});
  }

  return renderedRoutes;
}

function renderTripRouteGroup(options: TripRouteGroupOptions): StyledRouteLayer[] {
  const {colours, detail, leaflet, map, metadata, normalWeight, points} = options;
  const lines: StyledRouteLayer[] = [];
  let casingWeight = options.casingWeight;

  if (metadata.kind === "bonus") {
    lines.push(
      addStyledRouteLine({
        kind: metadata.kind,
        leaflet,
        map,
        pathOptions: {
          color: colours.copper,
          dashArray: "2 8",
          lineCap: "round",
          opacity: 0.95,
          weight: casingWeight + 4,
          interactive: detail,
        },
        points,
      }),
    );
  }

  const outing = metadata.kind === "walk" || metadata.kind === "hike";
  const ferry = metadata.kind === "ferry";
  const transit = metadata.kind === "transit";
  let casingColour = colours.ink;
  let routeColour = colours.ink;

  if (outing || ferry || transit) {
    casingColour = colours.paper;
  }

  if (ferry || transit) {
    routeColour = colours.petrol;
    casingWeight += 2;
  } else if (!outing && metadata.colourIndex !== undefined) {
    routeColour = tripRouteColour(metadata.colourIndex);
  }

  lines.push(
    addStyledRouteLine({
      kind: metadata.kind,
      leaflet,
      map,
      pathOptions: {
        color: casingColour,
        lineCap: "round",
        opacity: 0.9,
        weight: casingWeight,
        interactive: detail,
      },
      points,
    }),
  );

  const routeOptions: PathOptions = {
    color: routeColour,
    lineCap: "round",
    opacity: 0.95,
    weight: normalWeight,
    interactive: detail,
  };

  if (outing) {
    routeOptions.dashArray = "7 7";
  }

  if (ferry || transit) {
    routeOptions.dashArray = "3 9";
    routeOptions.weight = normalWeight + 1;
  }

  lines.push(addStyledRouteLine({kind: metadata.kind, leaflet, map, pathOptions: routeOptions, points}));
  return lines;
}
