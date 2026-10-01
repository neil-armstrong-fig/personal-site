import type {TripTransitGapManifest} from "./types/TripTransitGapManifest.ts";
import type {TripTransitGap} from "./types/TripTransitGap.ts";

const transitGapsByPath = import.meta.glob<TripTransitGapManifest>("/src/content/trip/entries/*/transit-gaps.json", {
  eager: true,
  import: "default",
});

export function getTripTransitGaps(tripId: string): readonly TripTransitGap[] {
  return transitGapsByPath[`/src/content/trip/entries/${tripId}/transit-gaps.json`]?.transitGaps ?? [];
}
