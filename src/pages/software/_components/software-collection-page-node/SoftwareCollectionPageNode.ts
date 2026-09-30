import type {CollectionEntry} from "astro:content";

import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";
import type {JsonLdNode} from "@src/site/structured-data/types/JsonLdNode";

interface SoftwareCollectionPageOptions {
  description: string;
  path: string;
  professionalCaseStudies: readonly CollectionEntry<"professionalCaseStudies">[];
  projects: readonly CollectionEntry<"projects">[];
}

interface CollectionItem {
  id: string;
  title: string;
}

export function buildSoftwareCollectionPageNode({
  description,
  path,
  professionalCaseStudies,
  projects,
}: SoftwareCollectionPageOptions): JsonLdNode {
  const url = absoluteUrl(path);
  const items: readonly CollectionItem[] = [
    ...professionalCaseStudies.map(caseStudy => ({id: caseStudy.id, title: caseStudy.data.title})),
    ...projects.map(project => ({id: project.id, title: project.data.title})),
  ];

  return {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: "Software architecture and engineering by Neil Armstrong",
    description,
    inLanguage: "en-GB",
    isPartOf: {"@id": siteIdentifiers.webSite},
    about: {"@id": siteIdentifiers.person},
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map(({id, title}, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: title,
        url: absoluteUrl(`/software/${id}/`),
      })),
    },
  };
}
