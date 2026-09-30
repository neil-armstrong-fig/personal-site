import type {PhotoMetadata} from "./types/PhotoMetadata";

export function hasSensitiveMetadata(metadata: PhotoMetadata): boolean {
  return (
    metadata.exif !== undefined ||
    metadata.xmp !== undefined ||
    metadata.iptc !== undefined ||
    metadata.icc !== undefined ||
    metadata.tifftagPhotoshop !== undefined
  );
}
