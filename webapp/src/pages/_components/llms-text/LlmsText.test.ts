import {expect, it} from "vitest";

import {buildLlmsText} from "./LlmsText";
import type {LlmsTextOptions} from "./types/LlmsTextOptions";

const options: LlmsTextOptions = {
  name: "Neil Armstrong",
  description: "A Belfast software architect.",
  caseStudies: [{title: "Serverless insurance", summary: "A twelve-month delivery.", path: "/software/serverless/"}],
  projects: [{title: "Janggi", summary: "A Korean chess app.", path: "/software/janggi/"}],
  profiles: [{label: "GitHub", href: "https://github.com/example"}],
};

it("starts with the name and a quoted description", () => {
  expect(buildLlmsText(options).startsWith("# Neil Armstrong\n\n> A Belfast software architect.\n")).toBe(true);
});

it("lists case studies and projects as absolute links with their summaries", () => {
  const text = buildLlmsText(options);

  expect(text).toContain(
    "## Professional work\n\n- [Serverless insurance](https://neilarmstrong.dev/software/serverless/): A twelve-month delivery.",
  );
  expect(text).toContain(
    "## Open-source projects\n\n- [Janggi](https://neilarmstrong.dev/software/janggi/): A Korean chess app.",
  );
});

it("links the key pages and the public profiles", () => {
  const text = buildLlmsText(options);

  expect(text).toContain("- [About](https://neilarmstrong.dev/about/)");
  expect(text).toContain("- [GitHub](https://github.com/example)");
});

it("ends with a single newline", () => {
  expect(buildLlmsText(options).endsWith("\n")).toBe(true);
  expect(buildLlmsText(options).endsWith("\n\n")).toBe(false);
});
