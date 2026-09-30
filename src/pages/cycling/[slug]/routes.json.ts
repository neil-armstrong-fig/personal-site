import type {APIRoute, GetStaticPaths} from "astro";

import {getPublishedTrips} from "@src/content/trip/GetPublishedTrips";
import {getTripFerries} from "@src/content/trip/ferries/GetTripFerries";
import type {TripRouteMapManifest} from "@src/content/trip/route-map/types/TripRouteMapManifest";
import {getTripRoutes} from "@src/content/trip/strava/routes/GetTripRoutes";
import {getTripTransitGaps} from "@src/content/trip/transit-gaps/GetTripTransitGaps";
import {getTripTransitRoutes} from "@src/content/trip/transit-routes/GetTripTransitRoutes";

interface Props {
  manifest: TripRouteMapManifest;
}

export const getStaticPaths = (async () => {
  const trips = await getPublishedTrips();

  return trips.flatMap(trip => {
    const routes = getTripRoutes(trip.id);

    if (routes === undefined) {
      return [];
    }

    const manifest: TripRouteMapManifest = {
      routes: routes.routes,
      ferries: [...getTripFerries(trip.id)],
      transitGaps: [...getTripTransitGaps(trip.id)],
      transitRoutes: [...getTripTransitRoutes(trip.id)],
    };
    return [{params: {slug: trip.id}, props: {manifest}}];
  });
}) satisfies GetStaticPaths;

export const GET: APIRoute<Props> = ({props}) =>
  new Response(JSON.stringify(props.manifest), {
    headers: {"Content-Type": "application/json; charset=utf-8"},
  });
