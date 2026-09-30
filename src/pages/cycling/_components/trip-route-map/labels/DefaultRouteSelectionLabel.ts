interface DefaultRouteSelectionLabelOptions {
  mappedRouteCount: number;
  highlightedCount: number;
}

// The route picker's own default (nothing explicitly selected): the chapter's own routes on a chapter page,
// or literally every mapped route on a trip page without one.
export function defaultRouteSelectionLabel(options: DefaultRouteSelectionLabelOptions): string {
  const {mappedRouteCount, highlightedCount} = options;

  if (highlightedCount > 0) {
    return `This part's ${highlightedCount} ${pluraliseRoute(highlightedCount)}`;
  }

  return `All ${mappedRouteCount} mapped routes`;
}

function pluraliseRoute(count: number): string {
  if (count === 1) {
    return "route";
  }

  return "routes";
}
