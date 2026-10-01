import {expect, it} from "vitest";

import {hasLocationMetadata} from "./HasLocationMetadata";

it("flags an ffmpeg report that lists a location tag", () => {
  const report =
    "  Metadata:\n    creation_time   : 2023-08-21T11:46:39.000000Z\n    location        : +51.6177-0.3790+000.000/";

  expect(hasLocationMetadata(report)).toBe(true);
});

it("flags the eng variant of the tag", () => {
  expect(hasLocationMetadata("    location-eng    : +51.6177-0.3790/")).toBe(true);
});

it("flags Apple's ISO 6709 tag", () => {
  expect(hasLocationMetadata("    com.apple.quicktime.location.ISO6709: +51.6177-0.3790/")).toBe(true);
});

it("accepts a report without any location", () => {
  expect(hasLocationMetadata("  Metadata:\n    major_brand     : isom\n    encoder         : Lavf58")).toBe(false);
});

it("does not treat a filename containing the word as a tag", () => {
  expect(hasLocationMetadata("Input #0, mov, from 'location-of-the-cliffs.mp4':")).toBe(false);
});
