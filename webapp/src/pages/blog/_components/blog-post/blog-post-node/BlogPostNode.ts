import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";
import type {JsonLdNode} from "@src/site/structured-data/types/JsonLdNode";

interface BlogPostNodeOptions {
  dateModified?: Date;
  datePublished: Date;
  description: string;
  headline: string;
  path: string;
  topics: readonly string[];
}

export function buildBlogPostNode({
  dateModified,
  datePublished,
  description,
  headline,
  path,
  topics,
}: BlogPostNodeOptions): JsonLdNode {
  const url = absoluteUrl(path);

  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: "en-GB",
    datePublished: datePublished.toISOString(),
    dateModified: (dateModified ?? datePublished).toISOString(),
    isPartOf: {"@id": siteIdentifiers.webSite},
    author: {"@id": siteIdentifiers.person},
    keywords: [...topics],
  };
}
