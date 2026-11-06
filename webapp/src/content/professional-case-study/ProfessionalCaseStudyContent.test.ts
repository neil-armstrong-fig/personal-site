import type {SchemaContext} from "astro:content";
import {z} from "astro/zod";
import {expect, it} from "vitest";

import {createProfessionalCaseStudyContentSchema} from "./ProfessionalCaseStudyContent";

const image: SchemaContext["image"] = () =>
  z.object({
    src: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.union([
      z.literal("png"),
      z.literal("jpg"),
      z.literal("jpeg"),
      z.literal("tiff"),
      z.literal("webp"),
      z.literal("gif"),
      z.literal("svg"),
      z.literal("avif"),
      z.literal("apng"),
    ]),
  });

const validDiagram = {
  image: {src: "/scenarios.png", width: 1600, height: 1050, format: "png"},
  mobileImage: {src: "/scenarios-mobile.png", width: 780, height: 2430, format: "png"},
  alt: "Scenarios confirmed with product become acceptance tests that guide AI implementation and human review.",
};

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
  expect(createProfessionalCaseStudyContentSchema({image}).parse(validCaseStudy)).toEqual(validCaseStudy);
});

it("accepts an optional positive-integer homepage order", () => {
  const caseStudy = {...validCaseStudy, homepageOrder: 2};

  expect(createProfessionalCaseStudyContentSchema({image}).parse(caseStudy)).toEqual(caseStudy);
});

it("rejects blank text, an empty technology list and invalid orders", () => {
  const result = createProfessionalCaseStudyContentSchema({image}).safeParse({
    ...validCaseStudy,
    careerPeriod: " ",
    sortOrder: 0,
    homepageOrder: 1.5,
    technologies: [],
  });

  expect(result.success).toBe(false);
});

it("rejects a non-positive homepage order", () => {
  expect(
    createProfessionalCaseStudyContentSchema({image}).safeParse({...validCaseStudy, homepageOrder: 0}).success,
  ).toBe(false);
});

it("accepts an optional role and team", () => {
  const caseStudy = {...validCaseStudy, role: "Tech lead", team: "Four engineers, line-managed"};

  expect(createProfessionalCaseStudyContentSchema({image}).parse(caseStudy)).toEqual(caseStudy);
});

it("rejects a blank role or team", () => {
  expect(createProfessionalCaseStudyContentSchema({image}).safeParse({...validCaseStudy, role: " "}).success).toBe(
    false,
  );
  expect(createProfessionalCaseStudyContentSchema({image}).safeParse({...validCaseStudy, team: ""}).success).toBe(
    false,
  );
});

it("preserves a diagram with desktop and phone compositions and alt text", () => {
  expect(
    createProfessionalCaseStudyContentSchema({image}).parse({...validCaseStudy, diagram: validDiagram}),
  ).toMatchObject({
    diagram: validDiagram,
  });
});

it("rejects a diagram without its phone composition", () => {
  const diagram = {image: validDiagram.image, alt: validDiagram.alt};

  expect(createProfessionalCaseStudyContentSchema({image}).safeParse({...validCaseStudy, diagram}).success).toBe(false);
});

it("preserves optional dark diagram compositions", () => {
  const diagram = {
    ...validDiagram,
    imageDark: {...validDiagram.image, src: "/scenarios-dark.png"},
    mobileImageDark: {...validDiagram.mobileImage, src: "/scenarios-mobile-dark.png"},
  };

  expect(createProfessionalCaseStudyContentSchema({image}).parse({...validCaseStudy, diagram})).toMatchObject({
    diagram,
  });
});

it("rejects a diagram with blank alt text", () => {
  const diagram = {...validDiagram, alt: " "};

  expect(createProfessionalCaseStudyContentSchema({image}).safeParse({...validCaseStudy, diagram}).success).toBe(false);
});
