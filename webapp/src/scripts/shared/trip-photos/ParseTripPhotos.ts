import {z} from "astro/zod";

import type {TripPhoto} from "./types/TripPhoto";

const requiredText = z.string().trim().min(1);
const tripPhotoSchema = z.object({
  source: requiredText.refine(source => !/[\\/]/.test(source), "Source must be a file name, not a path."),
  name: requiredText.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Name must be kebab-case."),
  alt: requiredText,
});
const manifestSchema = z.object({photos: z.array(tripPhotoSchema).min(1)});

export function parseTripPhotos(manifest: unknown): TripPhoto[] {
  const {photos} = manifestSchema.parse(manifest);

  assertUnique(
    photos.map(photo => photo.name),
    "output name",
  );
  assertUnique(
    photos.map(photo => photo.source),
    "source photo",
  );

  return photos;
}

function assertUnique(values: string[], label: string): void {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`Duplicate ${label}: ${value}`);
    }

    seen.add(value);
  }
}
