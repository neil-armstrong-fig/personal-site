import type {Map as LeafletMap} from "leaflet";

interface RegisterFullscreenMapOptions {
  synchroniseInteraction: boolean;
}

class RouteMapFullscreenController {
  private readonly leafletMaps = new Map<HTMLElement, LeafletMap>();

  initialise(): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>("[data-map-fullscreen-button]");

    for (const button of buttons) {
      const shell = button.closest<HTMLElement>("[data-route-map-shell]");

      if (shell === null || !document.fullscreenEnabled || button.dataset.fullscreenInitialised === "true") {
        continue;
      }

      button.dataset.fullscreenInitialised = "true";
      button.addEventListener("click", () => {
        void this.toggleFullscreen(shell).catch(() => {
          button.textContent = "Full screen unavailable";
          button.disabled = true;
        });
      });
    }

    document.addEventListener("fullscreenchange", () => {
      this.synchroniseFullscreenMaps();
    });
  }

  register(container: HTMLElement, map: LeafletMap, options: RegisterFullscreenMapOptions): void {
    this.leafletMaps.set(container, map);
    this.revealFullscreenButton(container);

    if (options.synchroniseInteraction) {
      this.synchroniseMapInteraction(container, map);
    }
  }

  private synchroniseFullscreenMaps(): void {
    for (const button of document.querySelectorAll<HTMLButtonElement>("[data-map-fullscreen-button]")) {
      const shell = button.closest<HTMLElement>("[data-route-map-shell]");
      const active = shell !== null && document.fullscreenElement === shell;
      const label = button.querySelector<HTMLElement>("[data-fullscreen-label]");
      let accessibleLabel = "Enter full screen";
      let visibleLabel = "Full screen";

      if (active) {
        accessibleLabel = "Exit full screen";
        visibleLabel = "Exit full screen";
      }

      button.setAttribute("aria-label", accessibleLabel);

      if (label !== null) {
        label.textContent = visibleLabel;
      }

      button.setAttribute("aria-pressed", String(active));
      const activityControls = shell?.querySelector<HTMLElement>("[data-activity-route-controls]");

      if (activityControls !== undefined && activityControls !== null) {
        activityControls.hidden = !active;
      }

      const mapContainer = shell?.querySelector<HTMLElement>("[data-activity-route-map], [data-trip-route-map]");

      if (mapContainer === undefined || mapContainer === null) {
        continue;
      }

      const map = this.leafletMaps.get(mapContainer);

      if (map !== undefined) {
        this.synchroniseMapInteraction(mapContainer, map);
      }
    }
  }

  private revealFullscreenButton(container: HTMLElement): void {
    const shell = container.closest<HTMLElement>("[data-route-map-shell]");
    const button = shell?.querySelector<HTMLButtonElement>("[data-map-fullscreen-button]");

    if (button !== undefined && button !== null && document.fullscreenEnabled) {
      button.hidden = false;
    }
  }

  private synchroniseMapInteraction(container: HTMLElement, map: LeafletMap): void {
    const shell = container.closest<HTMLElement>("[data-route-map-shell]");
    const fullscreen = shell !== null && document.fullscreenElement === shell;

    if (fullscreen) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }

    requestAnimationFrame(() => {
      map.invalidateSize({animate: false});
    });
  }

  private async toggleFullscreen(shell: HTMLElement): Promise<void> {
    if (document.fullscreenElement === shell) {
      await document.exitFullscreen();
      return;
    }

    await shell.requestFullscreen();
  }
}

export const routeMapFullscreenController = new RouteMapFullscreenController();
