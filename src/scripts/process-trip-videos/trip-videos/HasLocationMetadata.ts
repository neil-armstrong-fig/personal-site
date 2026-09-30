const LOCATION_TAG = /^\s+(?:com\.apple\.quicktime\.)?location(?:[.-]\w+)?\s*:/im;

export function hasLocationMetadata(ffmpegReport: string): boolean {
  return LOCATION_TAG.test(ffmpegReport);
}
