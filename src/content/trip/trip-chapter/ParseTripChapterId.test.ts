import {expect, it} from "vitest";

import {parseTripChapterId} from "./ParseTripChapterId";

it("splits a chapter id into its trip slug and chapter slug", () => {
  expect(parseTripChapterId("tokyo-to-seoul/part-2-tokyo-to-lake-biwa")).toEqual({
    tripSlug: "tokyo-to-seoul",
    chapterSlug: "tokyo-to-lake-biwa",
  });
});

it("rejects an id with no part number", () => {
  expect(() => parseTripChapterId("tokyo-to-seoul/tokyo-to-lake-biwa")).toThrow();
});

it("rejects an id with no trip slug", () => {
  expect(() => parseTripChapterId("part-2-tokyo-to-lake-biwa")).toThrow();
});
