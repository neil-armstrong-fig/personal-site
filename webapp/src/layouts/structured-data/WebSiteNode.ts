import {siteConfig} from "@src/site/SiteConfig";
import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";
import type {JsonLdNode} from "@src/site/structured-data/types/JsonLdNode";

export function buildWebSiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": siteIdentifiers.webSite,
    url: absoluteUrl("/"),
    name: siteConfig.siteName,
    alternateName: siteConfig.alternateSiteNames,
    description: siteConfig.description,
    inLanguage: "en-GB",
    publisher: {"@id": siteIdentifiers.person},
  };
}
