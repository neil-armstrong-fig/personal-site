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

it("rejects a sitemap with no canonical URLs", () => {
  expect(() => extractIndexNowUrls("<urlset></urlset>", "https://neilarmstrong.dev")).toThrow(
    "contains no canonical URLs",
  );
});
