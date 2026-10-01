export interface PhotoMetadata {
  exif?: Uint8Array;
  xmp?: Uint8Array;
  iptc?: Uint8Array;
  icc?: Uint8Array;
  tifftagPhotoshop?: Uint8Array;
}
