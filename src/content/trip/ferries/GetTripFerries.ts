import type {TripFerryManifest} from "./types/TripFerryManifest.ts";
import type {TripFerryRoute} from "./types/TripFerryRoute.ts";

const ferriesByPath = import.meta.glob<TripFerryManifest>("/src/content/trip/entries/*/ferries.json", {
  eager: true,
  import: "default",
});

export function getTripFerries(tripId: string): readonly TripFerryRoute[] {
  return ferriesByPath[`/src/content/trip/entries/${tripId}/ferries.json`]?.ferries ?? [];
}
