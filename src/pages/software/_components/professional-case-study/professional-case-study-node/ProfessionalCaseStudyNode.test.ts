import {expect, it} from "vitest";

import {buildProfessionalCaseStudyNode} from "./ProfessionalCaseStudyNode";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";

it("describes a professional case study as an article authored by the person", () => {
  const node = buildProfessionalCaseStudyNode({
    description: "How I modernised a legacy system.",
    headline: "A legacy system, rebuilt",
    path: "/software/legacy-system/",
    technologies: ["TypeScript", "AWS"],
  });

  expect(node).toMatchObject({
    "@type": "Article",
    "@id": "https://neilarmstrong.dev/software/legacy-system/#article",
    author: {"@id": siteIdentifiers.person},
    mainEntityOfPage: "https://neilarmstrong.dev/software/legacy-system/",
    keywords: ["TypeScript", "AWS"],
  });
});
