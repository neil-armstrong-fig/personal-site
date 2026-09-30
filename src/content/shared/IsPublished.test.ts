import {expect, it} from "vitest";

import {isPublished} from "./IsPublished";

it("treats only non-draft entries as published", () => {
  expect(isPublished({data: {draft: false}})).toBe(true);
  expect(isPublished({data: {draft: true}})).toBe(false);
});
