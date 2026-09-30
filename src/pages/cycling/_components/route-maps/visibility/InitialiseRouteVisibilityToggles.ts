import type {RouteVisibilityState} from "./types/RouteVisibilityState";

const visibilityToggleKinds = ["outings", "transit", "ferries"] as const;
type VisibilityToggleKind = (typeof visibilityToggleKinds)[number];
type OptionalDatasetValue = string | undefined;

export function initialiseRouteVisibilityToggles(
  shell: HTMLElement,
  state: RouteVisibilityState,
  applyStyles: () => void,
): void {
  const buttons = [...shell.querySelectorAll<HTMLButtonElement>("[data-route-visibility-toggle]")];

  for (const button of buttons) {
    const kind = button.dataset.routeVisibilityToggle;

    if (!isVisibilityToggleKind(kind)) {
      continue;
    }

    button.addEventListener("click", () => {
      const visible = button.getAttribute("aria-pressed") !== "true";

      if (kind === "outings") {
        state.outingsVisible = visible;
      }

      if (kind === "transit") {
        state.transitVisible = visible;
      }

      if (kind === "ferries") {
        state.ferriesVisible = visible;
      }

      updateVisibilityToggle(button, kind, visible);
      applyStyles();
    });
  }
}

function isVisibilityToggleKind(value: OptionalDatasetValue): value is VisibilityToggleKind {
  return visibilityToggleKinds.some(kind => kind === value);
}

function updateVisibilityToggle(button: HTMLButtonElement, kind: VisibilityToggleKind, visible: boolean): void {
  let action = "Show";
  let label = "ferries";
  let state = "Off";

  if (kind === "outings") {
    label = "walks and hikes";
  }

  if (kind === "transit") {
    label = "transit";
  }

  if (visible) {
    action = "Hide";
    state = "On";
  }

  button.setAttribute("aria-label", `${action} ${label}`);
  button.setAttribute("aria-pressed", String(visible));

  const stateLabel = button.querySelector<HTMLElement>("[data-route-visibility-state]");

  if (stateLabel !== null) {
    stateLabel.textContent = state;
  }
}
