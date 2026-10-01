import path from "node:path";

import {expect, it} from "vitest";

import {routeForHtmlPath} from "./RouteForHtmlPath";

const buildDirectory = path.join(process.cwd(), "dist");

it("maps the built root index to the root route", () => {
  expect(routeForHtmlPath(path.join(buildDirectory, "index.html"), buildDirectory)).toBe("/");
});

it("maps a nested index to its trailing-slash route", () => {
  expect(routeForHtmlPath(path.join(buildDirectory, "cycling", "porto-to-faro", "index.html"), buildDirectory)).toBe(
    "/cycling/porto-to-faro/",
  );
});

it("keeps the filename for a non-index HTML page", () => {
  expect(routeForHtmlPath(path.join(buildDirectory, "404.html"), buildDirectory)).toBe("/404.html");
});
