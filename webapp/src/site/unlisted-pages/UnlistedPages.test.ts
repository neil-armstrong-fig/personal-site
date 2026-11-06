import {expect, it} from "vitest";

import {isUnlistedPath, unlistedPaths} from "./UnlistedPages";

it("keeps the business card out of the sitemap", () => {
  expect(isUnlistedPath("/bc/")).toBe(true);
});

it("only lists paths that end in a slash, as the sitemap writes them", () => {
  expect(unlistedPaths().every(path => path.startsWith("/") && path.endsWith("/"))).toBe(true);
});

it("does not treat other paths as unlisted, including near misses", () => {
  expect(isUnlistedPath("/")).toBe(false);
  expect(isUnlistedPath("/contact/")).toBe(false);
  expect(isUnlistedPath("/bc")).toBe(false);
  expect(isUnlistedPath("/bc/extra/")).toBe(false);
  expect(isUnlistedPath("/about/bc/")).toBe(false);
});
