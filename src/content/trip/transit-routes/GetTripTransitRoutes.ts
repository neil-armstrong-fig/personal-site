import type {TripTransitRoute} from "./types/TripTransitRoute.ts";
import type {TripTransitRouteManifest} from "./types/TripTransitRouteManifest.ts";

const transitRoutesByPath = import.meta.glob<TripTransitRouteManifest>(
  "/src/content/trip/entries/*/transit-routes.json",
  {
    eager: true,
    import: "default",
  },
);

export function getTripTransitRoutes(tripId: string): readonly TripTransitRoute[] {
  return transitRoutesByPath[`/src/content/trip/entries/${tripId}/transit-routes.json`]?.transitRoutes ?? [];
}
