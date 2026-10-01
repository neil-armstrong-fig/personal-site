import {mkdir, readFile} from "node:fs/promises";

import sharp from "sharp";

import {hasSensitiveMetadata} from "@src/scripts/shared/trip-photos/HasSensitiveMetadata";
import {parseTripPhotos} from "@src/scripts/shared/trip-photos/ParseTripPhotos";
import {repositoryRoot} from "@src/scripts/shared/repository/RepositoryRoot";

const ROOT = process.cwd();
const LONG_EDGE_PX = 1600;
const MINIMUM_SOURCE_LONG_EDGE_PX = 1200;

await processTripPhotos(process.argv[2]);

async function processTripPhotos(tripSlug: string | undefined): Promise<void> {
  if (tripSlug === undefined || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(tripSlug)) {
    throw new Error("Usage: pnpm trip:photos <trip-slug>");
  }

  const privateDirectory = `${repositoryRoot}/private-source/trips/${tripSlug}`;
  const publicDirectory = `${ROOT}/src/content/trip/entries/${tripSlug}/_assets`;
  const photos = parseTripPhotos(JSON.parse(await readFile(`${privateDirectory}/photos.json`, "utf8")));

  await mkdir(publicDirectory, {recursive: true});

  for (const photo of photos) {
    const source = `${privateDirectory}/${photo.source}`;
    const destination = `${publicDirectory}/${photo.name}.jpg`;
    const {width = 0, height = 0} = await sharp(source).rotate().metadata();

    if (Math.max(width, height) < MINIMUM_SOURCE_LONG_EDGE_PX) {
      throw new Error(`${photo.source} is only ${width}x${height}; use a full-resolution original.`);
    }

    await sharp(source)
      .rotate()
      .resize({width: LONG_EDGE_PX, height: LONG_EDGE_PX, fit: "inside", withoutEnlargement: true})
      .jpeg({quality: 82, mozjpeg: true})
      .toFile(destination);

    if (hasSensitiveMetadata(await sharp(destination).metadata())) {
      throw new Error(`Sensitive metadata remains in ${destination}.`);
    }

    process.stdout.write(`${photo.source} -> ${photo.name}.jpg\n`);
  }
}
