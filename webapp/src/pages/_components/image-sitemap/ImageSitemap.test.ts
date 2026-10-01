import {expect, it} from "vitest";

import {buildImageSitemap} from "./ImageSitemap";

it("lists each page with its images and captions", () => {
  const xml = buildImageSitemap([
    {
      pageUrl: "https://neilarmstrong.dev/cycling/tokyo-to-seoul/",
      images: [
        {url: "https://neilarmstrong.dev/_astro/cover.abc.jpg", title: "Bike on a lookout"},
        {url: "https://neilarmstrong.dev/_astro/two.def.jpg"},
      ],
    },
  ]);

  expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
  expect(xml).toContain("<loc>https://neilarmstrong.dev/cycling/tokyo-to-seoul/</loc>");
  expect(xml).toContain("<image:loc>https://neilarmstrong.dev/_astro/cover.abc.jpg</image:loc>");
  expect(xml).toContain("<image:title>Bike on a lookout</image:title>");
  expect(xml.match(/<image:image>/g)).toHaveLength(2);
});

it("escapes XML special characters", () => {
  const xml = buildImageSitemap([
    {
      pageUrl: "https://neilarmstrong.dev/a/",
      images: [{url: "https://neilarmstrong.dev/i.jpg?a=1&b=2", title: '<Sun> & "sea"'}],
    },
  ]);

  expect(xml).toContain("<image:loc>https://neilarmstrong.dev/i.jpg?a=1&amp;b=2</image:loc>");
  expect(xml).toContain("<image:title>&lt;Sun&gt; &amp; &quot;sea&quot;</image:title>");
});

it("omits pages that have no images", () => {
  const xml = buildImageSitemap([{pageUrl: "https://neilarmstrong.dev/empty/", images: []}]);

  expect(xml).not.toContain("<url>");
});
