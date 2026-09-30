import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";
import type {JsonLdNode} from "@src/site/structured-data/types/JsonLdNode";

interface ProfilePageOptions {
  path: string;
  description: string;
}

export function buildProfilePageNode({path, description}: ProfilePageOptions): JsonLdNode {
  return {
    "@type": "ProfilePage",
    url: absoluteUrl(path),
    description,
    inLanguage: "en-GB",
    isPartOf: {"@id": siteIdentifiers.webSite},
    mainEntity: {"@id": siteIdentifiers.person},
  };
}
