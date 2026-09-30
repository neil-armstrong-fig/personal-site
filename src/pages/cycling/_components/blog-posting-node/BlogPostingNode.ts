import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import {formatIsoDate} from "@src/site/structured-data/dates/IsoDate";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";
import type {JsonLdNode} from "@src/site/structured-data/types/JsonLdNode";

type OptionalDate = Date | undefined;

interface BlogPostingOptions {
  headline: string;
  description: string;
  path: string;
  dateModified: OptionalDate;
}

// Trips carry no publication date, so datePublished is omitted rather than guessed from the ride dates.
export function buildBlogPostingNode({headline, description, path, dateModified}: BlogPostingOptions): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "BlogPosting",
    headline,
    description,
    inLanguage: "en-GB",
    mainEntityOfPage: absoluteUrl(path),
    author: {"@id": siteIdentifiers.person},
  };

  if (dateModified !== undefined) {
    node["dateModified"] = formatIsoDate(dateModified);
  }

  return node;
}
