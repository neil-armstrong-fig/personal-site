import {siteConfig} from "@src/site/SiteConfig";
import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";
import type {JsonLdNode} from "@src/site/structured-data/types/JsonLdNode";

export function buildPersonNode(): JsonLdNode {
  return {
    "@type": "Person",
    "@id": siteIdentifiers.person,
    name: siteConfig.identity.name,
    jobTitle: siteConfig.identity.publicTitle,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    homeLocation: {"@type": "Place", name: siteConfig.identity.location},
    sameAs: Object.values(siteConfig.socialLinks).map(link => link.href),
  };
}
