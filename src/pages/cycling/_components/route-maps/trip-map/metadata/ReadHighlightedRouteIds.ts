export function readHighlightedRouteIds(shell: HTMLElement): ReadonlySet<string> | undefined {
  const raw = shell.dataset.highlightedRouteIds;

  if (raw === undefined) {
    return undefined;
  }

  return new Set(raw.split(",").filter(id => id !== ""));
}
