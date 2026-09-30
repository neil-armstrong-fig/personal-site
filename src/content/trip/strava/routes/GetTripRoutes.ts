import type {TripRouteManifest} from "./types/TripRouteManifest.ts";

type OptionalTripRouteManifest = TripRouteManifest | undefined;

const routesByPath = import.meta.glob<TripRouteManifest>("/src/content/trip/entries/*/routes.json", {
  eager: true,
  import: "default",
});

export function getTripRoutes(tripId: string): OptionalTripRouteManifest {
  return routesByPath[`/src/content/trip/entries/${tripId}/routes.json`];
}
