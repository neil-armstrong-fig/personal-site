import {expect, it} from "vitest";

import {parseTripPhotos} from "./ParseTripPhotos";

const photo = {
  source: "boat sleep.jpg",
  name: "seat-legs-on-overnight-ferry",
  alt: "A pair of legs stretched across two seats",
};

it("returns the photos in manifest order", () => {
  const second = {source: "cabin.jpg", name: "narrow-ferry-cabin", alt: "A single bed in a narrow ferry cabin"};

  expect(parseTripPhotos({photos: [photo, second]})).toEqual([photo, second]);
});

it("trims the source and alt text", () => {
  expect(parseTripPhotos({photos: [{...photo, source: " boat sleep.jpg ", alt: "  Legs  "}]})).toEqual([
    {...photo, alt: "Legs"},
  ]);
});

it("rejects a manifest with no photos", () => {
  expect(() => parseTripPhotos({photos: []})).toThrow();
});

it("rejects blank alt text", () => {
  expect(() => parseTripPhotos({photos: [{...photo, alt: "  "}]})).toThrow();
});

it("rejects a name that is not kebab-case", () => {
  expect(() => parseTripPhotos({photos: [{...photo, name: "Boat Sleep"}]})).toThrow();
});

it("rejects a source that escapes the trip's photo folder", () => {
  expect(() => parseTripPhotos({photos: [{...photo, source: "../mugshot.jpg"}]})).toThrow();
});

it("rejects duplicate output names", () => {
  expect(() => parseTripPhotos({photos: [photo, {...photo, source: "other.jpg"}]})).toThrow(/duplicate/i);
});

it("rejects the same source used twice", () => {
  expect(() => parseTripPhotos({photos: [photo, {...photo, name: "another-name"}]})).toThrow(/duplicate/i);
});
