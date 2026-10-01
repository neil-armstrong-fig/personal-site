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

it("accepts an optional positive-integer homepage order", () => {
  const caseStudy = {...validCaseStudy, homepageOrder: 2};

  expect(createProfessionalCaseStudyContentSchema().parse(caseStudy)).toEqual(caseStudy);
});

it("rejects blank text, an empty technology list and invalid orders", () => {
  const result = createProfessionalCaseStudyContentSchema().safeParse({
    ...validCaseStudy,
    careerPeriod: " ",
    sortOrder: 0,
    homepageOrder: 1.5,
    technologies: [],
  });

  expect(result.success).toBe(false);
});

it("rejects a non-positive homepage order", () => {
  expect(createProfessionalCaseStudyContentSchema().safeParse({...validCaseStudy, homepageOrder: 0}).success).toBe(
    false,
  );
});

it("accepts an optional role and team", () => {
  const caseStudy = {...validCaseStudy, role: "Tech lead", team: "Four engineers, line-managed"};

  expect(createProfessionalCaseStudyContentSchema().parse(caseStudy)).toEqual(caseStudy);
});

it("rejects a blank role or team", () => {
  expect(createProfessionalCaseStudyContentSchema().safeParse({...validCaseStudy, role: " "}).success).toBe(false);
  expect(createProfessionalCaseStudyContentSchema().safeParse({...validCaseStudy, team: ""}).success).toBe(false);
});
