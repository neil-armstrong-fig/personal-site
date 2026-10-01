import {expect, it} from "vitest";

import {hasSensitiveMetadata} from "./HasSensitiveMetadata";

it("accepts an image with no embedded metadata", () => {
  expect(hasSensitiveMetadata({})).toBe(false);
});

it("flags EXIF, which carries GPS coordinates", () => {
  expect(hasSensitiveMetadata({exif: new Uint8Array([1])})).toBe(true);
});

it("flags XMP", () => {
  expect(hasSensitiveMetadata({xmp: new Uint8Array([1])})).toBe(true);
});

it("flags IPTC", () => {
  expect(hasSensitiveMetadata({iptc: new Uint8Array([1])})).toBe(true);
});

it("flags Photoshop resources", () => {
  expect(hasSensitiveMetadata({tifftagPhotoshop: new Uint8Array([1])})).toBe(true);
});

it("flags an embedded colour profile, which can identify the capture device", () => {
  expect(hasSensitiveMetadata({icc: new Uint8Array([1])})).toBe(true);
});
