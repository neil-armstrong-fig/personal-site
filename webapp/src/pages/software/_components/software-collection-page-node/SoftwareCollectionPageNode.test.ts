import {expect, it} from "vitest";
import type {CollectionEntry} from "astro:content";

import {buildSoftwareCollectionPageNode} from "./SoftwareCollectionPageNode";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";

it("connects the software collection and its visible entries to the person", () => {
  const node = buildSoftwareCollectionPageNode({
    description: "Software work by Neil Armstrong.",
    path: "/software/",
    professionalCaseStudies: [contentEntry("professional-case-study", "Legacy rebuild")],
    projects: [contentEntry("open-source-project", "Open-source project")],
  });

  expect(node).toMatchObject({
    "@type": "CollectionPage",
    "@id": "https://neilarmstrong.dev/software/#collection",
    about: {"@id": siteIdentifiers.person},
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Legacy rebuild",
          url: "https://neilarmstrong.dev/software/professional-case-study/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Open-source project",
          url: "https://neilarmstrong.dev/software/open-source-project/",
        },
      ],
    },
  });
});

function contentEntry(
  id: string,
  title: string,
): CollectionEntry<"professionalCaseStudies"> & CollectionEntry<"projects"> {
  return {id, data: {title}} as CollectionEntry<"professionalCaseStudies"> & CollectionEntry<"projects">;
}
