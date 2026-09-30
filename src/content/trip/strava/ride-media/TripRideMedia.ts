import type {ImageMetadata} from "astro";

import type {RideMedia} from "./types/RideMedia.ts";

type RideMediaEntry = [activityId: string, media: RideMedia];

interface RideMediaManifestPhoto {
  file: string;
  alt: string;
}

interface RideMediaManifest {
  photos: Record<string, RideMediaManifestPhoto>;
}

const manifestsByPath = import.meta.glob<RideMediaManifest>("/src/content/trip/entries/*/ride-media.json", {
  eager: true,
  import: "default",
});
const imagesByPath = import.meta.glob<ImageMetadata>(
  "/src/content/trip/entries/*/_assets/ride-log/*.{avif,jpeg,jpg,png,webp}",
  {
    eager: true,
    import: "default",
  },
);

export function getTripRideMedia(tripId: string): Readonly<Record<string, RideMedia>> {
  const manifest = manifestsByPath[`/src/content/trip/entries/${tripId}/ride-media.json`];

  if (manifest === undefined) {
    return {};
  }

  const entries: RideMediaEntry[] = [];

  for (const [activityId, photo] of Object.entries(manifest.photos)) {
    const image = imagesByPath[`/src/content/trip/entries/${tripId}/_assets/ride-log/${photo.file}`];

    if (image !== undefined) {
      entries.push([activityId, {image, alt: photo.alt}]);
    }
  }

  return Object.fromEntries(entries);
}
