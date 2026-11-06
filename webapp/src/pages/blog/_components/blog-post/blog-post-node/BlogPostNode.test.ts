import {expect, it} from "vitest";

import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";
import {buildBlogPostNode} from "./BlogPostNode";

it("describes a blog post as a blog posting authored by the person", () => {
  const node = buildBlogPostNode({
    dateModified: new Date("2026-11-06"),
    datePublished: new Date("2026-11-05"),
    description: "Build the whole flow first, roughly.",
    headline: "Fuzzy frontend",
    path: "/blog/fuzzy-frontend/",
    topics: ["Delivery", "Prototyping"],
  });

  expect(node).toMatchObject({
    "@type": "BlogPosting",
    "@id": "https://neilarmstrong.dev/blog/fuzzy-frontend/#article",
    author: {"@id": siteIdentifiers.person},
    datePublished: "2026-11-05T00:00:00.000Z",
    dateModified: "2026-11-06T00:00:00.000Z",
    mainEntityOfPage: "https://neilarmstrong.dev/blog/fuzzy-frontend/",
    keywords: ["Delivery", "Prototyping"],
  });
});

it("falls back to the published date when the post was never modified", () => {
  const node = buildBlogPostNode({
    datePublished: new Date("2026-11-05"),
    description: "Build the whole flow first, roughly.",
    headline: "Fuzzy frontend",
    path: "/blog/fuzzy-frontend/",
    topics: ["Delivery"],
  });

  expect(node).toMatchObject({dateModified: "2026-11-05T00:00:00.000Z"});
});
