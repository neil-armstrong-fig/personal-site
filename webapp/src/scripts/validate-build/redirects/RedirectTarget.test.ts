import {expect, it} from "vitest";

import {redirectTargetOf} from "./RedirectTarget";

it("reads the target of the meta refresh page Astro writes for a redirect", () => {
  const html =
    '<!doctype html><title>Redirecting to: /software/#blog</title><meta http-equiv="refresh" content="0;url=/software/#blog"><meta name="robots" content="noindex">';

  expect(redirectTargetOf(html)).toBe("/software/#blog");
});

it("returns undefined for a page that is not a redirect", () => {
  expect(redirectTargetOf("<!doctype html><title>About</title><h1>About</h1>")).toBeUndefined();
});
