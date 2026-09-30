import {expect, it} from "vitest";

import {assertUniqueSoftwareCaseStudyIds} from "./SoftwareCaseStudyIds";

it("accepts distinct open-source and professional case-study ids", () => {
  expect(() => assertUniqueSoftwareCaseStudyIds(["janggi"], ["build-it-again-better"])).not.toThrow();
});

it("rejects a slug shared by both case-study collections", () => {
  expect(() => assertUniqueSoftwareCaseStudyIds(["shared"], ["shared"])).toThrow("shared");
});
