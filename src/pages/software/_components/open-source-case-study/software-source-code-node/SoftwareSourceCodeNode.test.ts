import {expect, it} from "vitest";

import {buildSoftwareSourceCodeNode} from "./SoftwareSourceCodeNode";
import {siteIdentifiers} from "@src/site/structured-data/SiteIdentifiers";

it("describes a case study as source code authored by the person", () => {
  const node = buildSoftwareSourceCodeNode({
    name: "Janggi",
    description: "A Korean chess app.",
    path: "/software/janggi/",
    repositoryUrl: new URL("https://github.com/neil-armstrong-fig/janggi"),
    technologies: ["TypeScript", "React"],
    datePublished: new Date("2026-01-02T00:00:00Z"),
    dateModified: undefined,
  });

  expect(node).toMatchObject({
    "@type": "SoftwareSourceCode",
    codeRepository: "https://github.com/neil-armstrong-fig/janggi",
    author: {"@id": siteIdentifiers.person},
    keywords: ["TypeScript", "React"],
    datePublished: "2026-01-02",
  });
  expect(node).not.toHaveProperty("dateModified");
});
