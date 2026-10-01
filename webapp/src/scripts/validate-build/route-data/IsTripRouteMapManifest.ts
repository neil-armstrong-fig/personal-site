import type {TripRouteMapManifest} from "@src/content/trip/route-map/types/TripRouteMapManifest";
import type {PolylinePoint} from "@src/content/trip/strava/routes/types/PolylinePoint";

export function isTripRouteMapManifest(value: unknown): value is TripRouteMapManifest {
  if (
    !isRecord(value) ||
    !isRecord(value.routes) ||
    !Array.isArray(value.ferries) ||
    !Array.isArray(value.transitGaps) ||
    !Array.isArray(value.transitRoutes)
  ) {
    return false;
  }

  for (const encodedRoute of Object.values(value.routes)) {
    if (typeof encodedRoute !== "string") {
      return false;
    }
  }

  for (const ferry of value.ferries) {
    if (!isRecord(ferry) || typeof ferry.id !== "string" || typeof ferry.name !== "string") {
      return false;
    }

    if (typeof ferry.sourceUrl !== "string" || !ferry.sourceUrl.startsWith("https://")) {
      return false;
    }

    if (!Array.isArray(ferry.points) || ferry.points.length < 2 || !ferry.points.every(isCoordinatePair)) {
      return false;
    }

    if (ferry.activityId !== undefined && typeof ferry.activityId !== "number") {
      return false;
    }
  }

  for (const transitGap of value.transitGaps) {
    if (
      !isRecord(transitGap) ||
      typeof transitGap.activityId !== "number" ||
      typeof transitGap.minimumGapMetres !== "number" ||
      transitGap.minimumGapMetres < 1_000
    ) {
      return false;
    }
  }

  for (const transitRoute of value.transitRoutes) {
    if (
      !isRecord(transitRoute) ||
      typeof transitRoute.id !== "string" ||
      typeof transitRoute.activityId !== "number" ||
      typeof transitRoute.name !== "string" ||
      typeof transitRoute.sourceUrl !== "string" ||
      !transitRoute.sourceUrl.startsWith("https://") ||
      !Array.isArray(transitRoute.points) ||
      transitRoute.points.length < 2 ||
      !transitRoute.points.every(isCoordinatePair)
    ) {
      return false;
    }
  }

  return true;
}

function isCoordinatePair(value: unknown): value is PolylinePoint {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    value[0] >= -90 &&
    value[0] <= 90 &&
    value[1] >= -180 &&
    value[1] <= 180
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
