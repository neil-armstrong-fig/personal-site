import {renderActivityMap} from "@src/pages/cycling/_components/route-maps/activity-map/RenderActivityMap";
import {routeMapFullscreenController} from "@src/pages/cycling/_components/route-maps/fullscreen/RouteMapFullscreenController";
import {renderTripMap} from "@src/pages/cycling/_components/route-maps/trip-map/RenderTripMap";

type OptionalIntersectionObserver = IntersectionObserver | undefined;

let initialised = false;

export function initialiseRouteMaps(): void {
  if (initialised) {
    return;
  }

  initialised = true;
  routeMapFullscreenController.initialise();
  observeTripMaps();
  observeActivityMaps();
}

function observeTripMaps(): void {
  const containers = [...document.querySelectorAll<HTMLElement>("[data-trip-route-map]")];

  observeWhenNear(containers, container => {
    const shell = container.closest<HTMLElement>("[data-trip-route-map-shell][data-routes-url]");
    const routesUrl = shell?.dataset.routesUrl ?? "";

    void renderTripMap(container, routesUrl).catch(() => {
      failTripMap(container);
    });
  });
}

function observeActivityMaps(): void {
  for (const rideLog of document.querySelectorAll<HTMLElement>("[data-ride-log][data-routes-url]")) {
    const details = rideLog.querySelector("details");

    if (details === null) {
      continue;
    }

    let observer: OptionalIntersectionObserver;
    const observeMaps = (): void => {
      if (!details.open || observer !== undefined) {
        return;
      }

      const containers = [...rideLog.querySelectorAll<HTMLElement>("[data-activity-route-map]")];
      observer = observeWhenNear(containers, container => {
        void renderActivityMap(container, rideLog.dataset.routesUrl ?? "").catch(() => {
          container.textContent = "Route map unavailable.";
        });
      });
    };

    details.addEventListener("toggle", observeMaps);
    observeMaps();
  }
}

function observeWhenNear(
  containers: readonly HTMLElement[],
  render: (container: HTMLElement) => void,
): OptionalIntersectionObserver {
  if (!("IntersectionObserver" in window)) {
    for (const container of containers) {
      render(container);
    }

    return undefined;
  }

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
          continue;
        }

        observer.unobserve(entry.target);
        render(entry.target);
      }
    },
    {rootMargin: "200px"},
  );

  for (const container of containers) {
    observer.observe(container);
  }

  return observer;
}

function failTripMap(container: HTMLElement): void {
  const shell = container.closest<HTMLElement>("[data-trip-route-map-shell]");

  if (shell === null) {
    return;
  }

  shell.dataset.mapState = "unavailable";
  const status = shell.querySelector<HTMLElement>("[data-trip-route-map-status]");

  if (status !== null) {
    status.textContent = "Route map unavailable.";
    status.hidden = false;
  }
}
