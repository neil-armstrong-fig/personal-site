import type {TripRouteMetadata} from "@src/pages/cycling/_components/route-maps/trip-map/types/TripRouteMetadata";
import type {TripMapActivityKind} from "@src/pages/cycling/_components/trip-route-map/types/TripMapActivityKind";

type OptionalDatasetValue = string | undefined;

export function readTripRouteMetadata(shell: HTMLElement): TripRouteMetadata[] {
  const metadata: TripRouteMetadata[] = [];

  for (const element of shell.querySelectorAll<HTMLElement>("[data-trip-route-activity]")) {
    const id = element.dataset.activityId;
    const kind = element.dataset.activityKind;

    if (id === undefined || !isTripMapActivityKind(kind)) {
      continue;
    }

    const route: TripRouteMetadata = {
      id,
      kind,
      start: element.dataset.routeStart === "true",
      finish: element.dataset.routeFinish === "true",
      selectionLabel: element.dataset.selectionLabel ?? "Mapped activity",
    };
    const colourIndex = Number(element.dataset.colourIndex);

    if (element.dataset.colourIndex !== undefined && Number.isInteger(colourIndex)) {
      route.colourIndex = colourIndex;
    }

    metadata.push(route);
  }

  return metadata;
}

function isTripMapActivityKind(value: OptionalDatasetValue): value is TripMapActivityKind {
  return value === "ride" || value === "transition" || value === "bonus" || value === "walk" || value === "hike";
}
