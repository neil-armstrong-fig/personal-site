import {expect, it} from "vitest";

import {sitemapSourcesOf} from "./SitemapSources";

it("dates the home page by the page and everything it lists", () => {
  expect(sitemapSourcesOf("/")).toEqual([
    "src/pages/index.astro",
    "src/pages/_components",
    "src/content/project/entries",
    "src/content/professional-case-study/entries",
    "src/content/trip/entries",
  ]);
});

it("dates a standalone page by its own folder", () => {
  expect(sitemapSourcesOf("/about/")).toEqual(["src/pages/about"]);
  expect(sitemapSourcesOf("/contact/")).toEqual(["src/pages/contact"]);
  expect(sitemapSourcesOf("/privacy/")).toEqual(["src/pages/privacy"]);
});

it("dates the software index by the page and the two kinds of entry it lists", () => {
  expect(sitemapSourcesOf("/software/")).toEqual([
    "src/pages/software/index.astro",
    "src/pages/software/_components",
    "src/content/project/entries",
    "src/content/professional-case-study/entries",
  ]);
});

it("dates a software page by its route and whichever entry carries its slug", () => {
  expect(sitemapSourcesOf("/software/janggi/")).toEqual([
    "src/pages/software/[slug].astro",
    "src/pages/software/_components",
    "src/content/project/entries/janggi",
    "src/content/professional-case-study/entries/janggi",
  ]);
});

it("dates the cycling index by the page and the trips it lists", () => {
  expect(sitemapSourcesOf("/cycling/")).toEqual([
    "src/pages/cycling/index.astro",
    "src/pages/cycling/_components",
    "src/content/trip/entries",
  ]);
});

it("dates a trip by its route and its own entry", () => {
  expect(sitemapSourcesOf("/cycling/porto-to-faro/")).toEqual([
    "src/pages/cycling/[slug].astro",
    "src/pages/cycling/_components",
    "src/content/trip/entries/porto-to-faro",
  ]);
});

it("dates a chapter by the chapter route and the entry of the trip it belongs to", () => {
  expect(sitemapSourcesOf("/cycling/tokyo-to-seoul/into-seoul/")).toEqual([
    "src/pages/cycling/[slug]/[chapter].astro",
    "src/pages/cycling/_components",
    "src/content/trip/entries/tokyo-to-seoul",
  ]);
});

it("refuses a page it does not know how to date, rather than guess a date", () => {
  expect(() => sitemapSourcesOf("/shop/")).toThrow("/shop/");
  expect(() => sitemapSourcesOf("/cycling/a/b/c/")).toThrow("/cycling/a/b/c/");
});
