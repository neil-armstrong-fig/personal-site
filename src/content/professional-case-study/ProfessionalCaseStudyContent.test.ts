import {expect, it} from "vitest";

import {createProfessionalCaseStudyContentSchema} from "./ProfessionalCaseStudyContent";

const validCaseStudy = {
  title: "Build it again, but better",
  summary: "An enterprise modernisation delivered without user-facing regression.",
  careerPeriod: "2025–2026",
  sortOrder: 1,
  technologies: ["TypeScript", "React", "AWS Lambda"],
  draft: false,
  seoDescription: "How I modernised a critical enterprise platform while preserving its behaviour.",
};

it("accepts a complete professional case study", () => {
  expect(createProfessionalCaseStudyContentSchema().parse(validCaseStudy)).toEqual(validCaseStudy);
});

it("rejects blank text, an empty technology list and a non-positive sort order", () => {
  const result = createProfessionalCaseStudyContentSchema().safeParse({
    ...validCaseStudy,
    careerPeriod: " ",
    sortOrder: 0,
    technologies: [],
  });

  expect(result.success).toBe(false);
});
