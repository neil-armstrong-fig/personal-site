interface RouteSelectionState {
  selectedRouteId: string;
  highlightedRouteIds?: ReadonlySet<string>;
}

interface RouteEmphasis {
  // Whether the route renders at full opacity at all (false means muted, per the 0.18 fallback opacity).
  visible: boolean;
  // Whether the route gets the extra stroke weight and is brought to the front, on top of being visible.
  emphasised: boolean;
}

// A route is "selected" (one explicit pick from the route picker) takes priority; with nothing explicitly
// picked, a chapter page's highlighted set stands in as the default "selection"; with neither, every route
// counts as visible (the plain trip-overview behaviour), and none gets the extra emphasis.
export function routeEmphasis(routeId: string, state: RouteSelectionState): RouteEmphasis {
  if (state.selectedRouteId !== "") {
    const matches = routeId === state.selectedRouteId;

    return {visible: matches, emphasised: matches};
  }

  if (state.highlightedRouteIds !== undefined) {
    const matches = state.highlightedRouteIds.has(routeId);

    return {visible: matches, emphasised: matches};
  }

  return {visible: true, emphasised: false};
}
