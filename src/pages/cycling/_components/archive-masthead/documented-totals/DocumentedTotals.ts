import type {TripSnapshot} from "@src/content/trip/strava/snapshot/types/TripSnapshot";

interface PublicationState {
  draft: boolean;
}

interface TripWithPublicationState {
  id: string;
  data: PublicationState;
}

type OptionalTripSnapshot = TripSnapshot | undefined;

interface DocumentedTotals {
  publishedTrips: number;
  documentedTrips: number;
  distanceMetres: number;
  ridingDays: number;
}

export function calculateDocumentedTotals(
  trips: readonly TripWithPublicationState[],
  getSnapshot: (tripId: string) => OptionalTripSnapshot,
): DocumentedTotals {
  const publishedTrips = trips.filter(trip => !trip.data.draft);

  return publishedTrips.reduce<DocumentedTotals>(
    (totals, trip) => {
      const snapshot = getSnapshot(trip.id);

      if (snapshot === undefined) {
        return totals;
      }

      return {
        ...totals,
        documentedTrips: totals.documentedTrips + 1,
        distanceMetres: totals.distanceMetres + snapshot.totals.distanceMetres,
        ridingDays: totals.ridingDays + snapshot.totals.days,
      };
    },
    {publishedTrips: publishedTrips.length, documentedTrips: 0, distanceMetres: 0, ridingDays: 0},
  );
}
