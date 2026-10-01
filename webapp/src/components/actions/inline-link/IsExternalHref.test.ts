import {expect, it} from "vitest";

import {isExternalHref} from "@src/components/actions/inline-link/IsExternalHref";

it("treats http and https URLs as external", () => {
  expect(isExternalHref("https://www.strava.com")).toBe(true);
  expect(isExternalHref("http://example.com/a")).toBe(true);
});

it("treats site paths and fragments as internal", () => {
  expect(isExternalHref("/contact/")).toBe(false);
  expect(isExternalHref("#main-content")).toBe(false);
});
