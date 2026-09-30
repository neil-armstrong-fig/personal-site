import type {TripMapActivity} from "@src/pages/cycling/_components/trip-route-map/types/TripMapActivity";
import type {TripMapActivityKind} from "@src/pages/cycling/_components/trip-route-map/types/TripMapActivityKind";

export function tripMapSelectionLabel(activity: TripMapActivity): string {
  return `${kindLabel(activity.kind)} · ${activity.date} · ${activity.name}`;
}

function kindLabel(kind: TripMapActivityKind): string {
  if (kind === "bonus") {
    return "Bonus ride";
  }

  if (kind === "transition") {
    return "Transition ride";
  }

  if (kind === "walk") {
    return "Walk";
  }

  if (kind === "hike") {
    return "Hike";
  }

  return "Ride";
}
