import {expect, it} from "vitest";

import {absoluteUrl} from "./AbsoluteUrl";

it("resolves a root-relative path against the production origin", () => {
  expect(absoluteUrl("/software/janggi/")).toBe("https://neilarmstrong.dev/software/janggi/");
});

it("resolves the home page to the bare origin with a trailing slash", () => {
  expect(absoluteUrl("/")).toBe("https://neilarmstrong.dev/");
});

it("leaves an already absolute URL unchanged", () => {
  expect(absoluteUrl("https://example.com/a")).toBe("https://example.com/a");
});
