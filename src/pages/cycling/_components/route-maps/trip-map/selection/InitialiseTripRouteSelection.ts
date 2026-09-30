import type {StyledRouteLayer} from "@src/pages/cycling/_components/route-maps/leaflet/types/StyledRouteLayer";
import {fitTripMapBounds} from "@src/pages/cycling/_components/route-maps/trip-map/bounds/FitTripMapBounds";
import {routeEmphasis} from "@src/pages/cycling/_components/route-maps/trip-map/selection/RouteEmphasis";
import type {RenderedTripRoute} from "@src/pages/cycling/_components/route-maps/trip-map/types/RenderedTripRoute";
import {defaultRouteSelectionLabel} from "@src/pages/cycling/_components/trip-route-map/labels/DefaultRouteSelectionLabel";
import {initialiseRouteVisibilityToggles} from "@src/pages/cycling/_components/route-maps/visibility/InitialiseRouteVisibilityToggles";
import type {RouteVisibilityState} from "@src/pages/cycling/_components/route-maps/visibility/types/RouteVisibilityState";
import {isTripRouteLayerVisible} from "@src/pages/cycling/_components/trip-route-map/visibility/TripRouteVisibility";
import type {CircleMarker, LatLngBounds, Map as LeafletMap} from "leaflet";

interface InitialiseTripRouteSelectionOptions {
  allBounds: LatLngBounds;
  ferryTerminalMarkers: CircleMarker[];
  map: LeafletMap;
  routes: RenderedTripRoute[];
  shell: HTMLElement;
  highlightedRouteIds?: ReadonlySet<string>;
  highlightedBounds?: LatLngBounds;
}

interface TripMapState extends InitialiseTripRouteSelectionOptions, RouteVisibilityState {
  selectedRouteId: string;
}

export function initialiseTripRouteSelection(options: InitialiseTripRouteSelectionOptions): void {
  const state: TripMapState = {
    ...options,
    ferriesVisible: true,
    outingsVisible: true,
    selectedRouteId: "",
    transitVisible: true,
  };
  const {shell} = state;
  initialiseRouteVisibilityToggles(shell, state, () => {
    applyTripRouteLayerStyles(state);
  });
  applyTripRouteLayerStyles(state);

  const picker = shell.querySelector<HTMLDetailsElement>("[data-trip-route-picker]");
  const pickerLabel = shell.querySelector<HTMLElement>("[data-trip-route-picker-label]");
  const clearButton = shell.querySelector<HTMLButtonElement>("[data-trip-route-clear]");
  const routeOptions = [...shell.querySelectorAll<HTMLButtonElement>("[data-trip-route-option]")];
  const output = shell.querySelector<HTMLElement>("[data-trip-route-selection]");

  if (picker === null || pickerLabel === null || clearButton === null || output === null) {
    return;
  }

  pickerLabel.textContent = defaultLabel(state);
  output.textContent = `${defaultLabel(state)} shown.`;

  const selectRoute = (routeId: string): void => {
    state.selectedRouteId = routeId;
    applyTripRouteLayerStyles(state);
    synchroniseRouteOptions(routeOptions, routeId);
    picker.open = false;

    if (routeId === "") {
      pickerLabel.textContent = defaultLabel(state);
      output.textContent = `${defaultLabel(state)} shown.`;
      clearButton.hidden = true;
      fitTripMapBounds({bounds: state.highlightedBounds ?? state.allBounds, map: state.map, padding: 32, shell});
      return;
    }

    const route = state.routes.find(candidate => candidate.metadata.id === routeId);

    if (route === undefined) {
      return;
    }

    pickerLabel.textContent = route.metadata.selectionLabel;
    output.textContent = route.metadata.selectionLabel;
    clearButton.hidden = false;
    fitTripMapBounds({bounds: route.bounds, map: state.map, padding: 48, shell});
  };

  for (const routeOption of routeOptions) {
    routeOption.addEventListener("click", () => {
      selectRoute(routeOption.dataset.routeId ?? "");
    });
  }

  clearButton.addEventListener("click", () => {
    selectRoute("");
  });

  picker.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !picker.open) {
      return;
    }

    picker.open = false;
    picker.querySelector("summary")?.focus();
  });

  document.addEventListener("pointerdown", event => {
    if (picker.open && event.target instanceof Node && !picker.contains(event.target)) {
      picker.open = false;
    }
  });

  for (const route of state.routes) {
    for (const {layer} of route.layers) {
      layer.on("click", () => {
        selectRoute(route.metadata.id);
      });
    }
  }
}

function defaultLabel(state: TripMapState): string {
  return defaultRouteSelectionLabel({
    mappedRouteCount: state.routes.length,
    highlightedCount: state.highlightedRouteIds?.size ?? 0,
  });
}

function synchroniseRouteOptions(routeOptions: readonly HTMLButtonElement[], routeId: string): void {
  for (const routeOption of routeOptions) {
    routeOption.setAttribute("aria-pressed", String((routeOption.dataset.routeId ?? "") === routeId));
  }
}

function applyTripRouteLayerStyles(state: TripMapState): void {
  for (const route of state.routes) {
    const emphasis = routeEmphasis(route.metadata.id, state);

    for (const styledLayer of route.layers) {
      const kindVisible = layerVisible(state, styledLayer);
      let weight = styledLayer.baseWeight;

      if (emphasis.emphasised) {
        weight += 2;
      }

      let opacity = 0.18;

      if (emphasis.visible) {
        opacity = styledLayer.baseOpacity;
      }

      if (!kindVisible) {
        opacity = 0;
        weight = 0;
      }

      styledLayer.layer.setStyle({interactive: kindVisible, opacity, weight});
    }

    if (emphasis.emphasised) {
      for (const styledLayer of route.layers) {
        if (layerVisible(state, styledLayer)) {
          styledLayer.layer.bringToFront();
        }
      }
    }
  }

  applyFerryTerminalMarkerStyles(state);
}

function layerVisible(state: TripMapState, styledLayer: StyledRouteLayer): boolean {
  return isTripRouteLayerVisible({
    ferriesVisible: state.ferriesVisible,
    kind: styledLayer.kind,
    outingsVisible: state.outingsVisible,
    transitVisible: state.transitVisible,
  });
}

function applyFerryTerminalMarkerStyles(state: TripMapState): void {
  let opacity = 0;
  let radius = 0;

  if (state.ferriesVisible) {
    opacity = 1;
    radius = 4;
  }

  for (const marker of state.ferryTerminalMarkers) {
    marker.setRadius(radius);
    marker.setStyle({
      fillOpacity: opacity,
      interactive: state.ferriesVisible,
      opacity,
    });
  }
}
