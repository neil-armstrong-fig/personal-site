import {readdirSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

import sharp from "sharp";
import {expect, it} from "vitest";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));

it("ships no EXIF, XMP or IPTC metadata in any public raster image", async () => {
  const rasters = ["public", "src"].flatMap(directory => findRasters(path.join(ROOT, directory)));
  const withMetadata: string[] = [];

  expect(rasters.length).toBeGreaterThan(0);

  for (const raster of rasters) {
    const {exif, xmp, iptc} = await sharp(raster).metadata();

    if (exif !== undefined || xmp !== undefined || iptc !== undefined) {
      withMetadata.push(path.relative(ROOT, raster));
    }
  }

  expect(withMetadata).toEqual([]);
});

function findRasters(directory: string): string[] {
  return readdirSync(directory, {withFileTypes: true, recursive: true})
    .filter(entry => entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name))
    .map(entry => path.join(entry.parentPath, entry.name));
}
