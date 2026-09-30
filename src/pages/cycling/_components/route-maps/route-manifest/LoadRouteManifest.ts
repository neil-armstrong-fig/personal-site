import type {TripRouteMapManifest} from "@src/content/trip/route-map/types/TripRouteMapManifest";

const routeRequests = new Map<string, Promise<TripRouteMapManifest>>();

export function loadRouteManifest(routesUrl: string): Promise<TripRouteMapManifest> {
  const existing = routeRequests.get(routesUrl);

  if (existing !== undefined) {
    return existing;
  }

  const request = fetch(routesUrl).then(async response => {
    if (!response.ok) {
      throw new Error(`Route request failed with status ${response.status}.`);
    }

    return (await response.json()) as TripRouteMapManifest;
  });

  routeRequests.set(routesUrl, request);
  return request;
}
