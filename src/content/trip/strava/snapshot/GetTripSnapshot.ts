import type {TripSnapshot} from "./types/TripSnapshot.ts";

type OptionalTripSnapshot = TripSnapshot | undefined;

const snapshotsByPath = import.meta.glob<TripSnapshot>("/src/content/trip/entries/*/strava.json", {
  eager: true,
  import: "default",
});

export function getTripSnapshot(tripId: string): OptionalTripSnapshot {
  return snapshotsByPath[`/src/content/trip/entries/${tripId}/strava.json`];
}
