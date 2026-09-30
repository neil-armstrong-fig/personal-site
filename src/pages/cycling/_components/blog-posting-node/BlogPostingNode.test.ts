import {expect, it} from "vitest";

import {buildBlogPostingNode} from "./BlogPostingNode";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";

it("describes a trip as a blog posting without inventing a publication date", () => {
  const node = buildBlogPostingNode({
    headline: "Coast to coast",
    description: "A ride.",
    path: "/cycling/coast/",
    dateModified: new Date("2026-03-04T00:00:00Z"),
  });

  expect(node).toMatchObject({
    "@type": "BlogPosting",
    author: {"@id": siteIdentifiers.person},
    mainEntityOfPage: "https://neilarmstrong.dev/cycling/coast/",
    dateModified: "2026-03-04",
  });
  expect(node).not.toHaveProperty("datePublished");
});
