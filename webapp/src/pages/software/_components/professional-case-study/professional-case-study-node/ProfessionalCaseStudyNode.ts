import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";
import type {JsonLdNode} from "@src/site/structured-data/types/JsonLdNode";

interface ProfessionalCaseStudyNodeOptions {
  description: string;
  headline: string;
  path: string;
  technologies: readonly string[];
}

export function buildProfessionalCaseStudyNode({
  description,
  headline,
  path,
  technologies,
}: ProfessionalCaseStudyNodeOptions): JsonLdNode {
  const url = absoluteUrl(path);

  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: "en-GB",
    isPartOf: {"@id": siteIdentifiers.webSite},
    author: {"@id": siteIdentifiers.person},
    keywords: [...technologies],
  };
}
