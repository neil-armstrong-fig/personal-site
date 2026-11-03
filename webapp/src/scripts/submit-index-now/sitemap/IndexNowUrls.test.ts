import {expect, it} from "vitest";

import {extractIndexNowUrls} from "./IndexNowUrls";

it("extracts canonical URLs from the deployed sitemap", () => {
  const sitemap = `
    <urlset>
      <url><loc>https://neilarmstrong.dev/</loc></url>
      <url><loc>https://neilarmstrong.dev/software/</loc></url>
    </urlset>
  `;

  expect(extractIndexNowUrls(sitemap, "https://neilarmstrong.dev")).toEqual([
    "https://neilarmstrong.dev/",
    "https://neilarmstrong.dev/software/",
  ]);
});

it("rejects a sitemap containing a URL from another origin", () => {
  const sitemap = "<urlset><url><loc>https://example.com/software/</loc></url></urlset>";

  expect(() => extractIndexNowUrls(sitemap, "https://neilarmstrong.dev")).toThrow(
    "does not belong to https://neilarmstrong.dev",
  );
});

it("keeps only the pages that changed on or after the given day", () => {
  const sitemap = `
    <urlset>
      <url><loc>https://neilarmstrong.dev/</loc><lastmod>2026-11-03</lastmod></url>
      <url><loc>https://neilarmstrong.dev/about/</loc><lastmod>2026-11-01</lastmod></url>
      <url><loc>https://neilarmstrong.dev/software/</loc><lastmod>2026-10-05</lastmod></url>
    </urlset>
  `;

  expect(extractIndexNowUrls(sitemap, "https://neilarmstrong.dev", "2026-11-01")).toEqual([
    "https://neilarmstrong.dev/",
    "https://neilarmstrong.dev/about/",
  ]);
});

it("treats a page with no date as changed, since nothing says it has not", () => {
  const sitemap = "<urlset><url><loc>https://neilarmstrong.dev/about/</loc></url></urlset>";

  expect(extractIndexNowUrls(sitemap, "https://neilarmstrong.dev", "2026-11-01")).toEqual([
    "https://neilarmstrong.dev/about/",
  ]);
});

it("returns nothing, rather than failing, when no page changed since the given day", () => {
  const sitemap = "<urlset><url><loc>https://neilarmstrong.dev/</loc><lastmod>2026-10-05</lastmod></url></urlset>";

  expect(extractIndexNowUrls(sitemap, "https://neilarmstrong.dev", "2026-11-01")).toEqual([]);
});

it("still checks the origin of a page that did not change", () => {
  const sitemap = "<urlset><url><loc>https://example.com/</loc><lastmod>2026-10-05</lastmod></url></urlset>";

  expect(() => extractIndexNowUrls(sitemap, "https://neilarmstrong.dev", "2026-11-01")).toThrow(
    "does not belong to https://neilarmstrong.dev",
  );
});

it("rejects a sitemap with no canonical URLs", () => {
  expect(() => extractIndexNowUrls("<urlset></urlset>", "https://neilarmstrong.dev")).toThrow(
    "contains no canonical URLs",
  );
});
