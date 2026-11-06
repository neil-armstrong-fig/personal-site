import type {SchemaContext} from "astro:content";
import {z} from "astro/zod";
import {expect, it} from "vitest";

import {createBlogPostContentSchema} from "./BlogPostContent";

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
  image: {src: "/flow.png", width: 1600, height: 1000, format: "png"},
  mobileImage: {src: "/flow-mobile.png", width: 780, height: 2420, format: "png"},
  alt: "A rough request flow becomes a refined interface after feedback removes an unnecessary step.",
};

const validPost = {
  title: "Fuzzy frontend",
  summary: "Build the whole flow first, roughly, and show it to people.",
  datePublished: "2026-11-05",
  topics: ["Delivery", "Prototyping"],
  draft: false,
  seoDescription: "A technique for validating a feature end to end before the rest of the work begins.",
};

it("accepts a complete blog post and parses its date", () => {
  expect(createBlogPostContentSchema({image}).parse(validPost)).toEqual({
    ...validPost,
    datePublished: new Date("2026-11-05"),
  });
});

it("accepts an optional modified date, homepage order and SEO title", () => {
  const post = {...validPost, dateModified: "2026-11-06", homepageOrder: 2, seoTitle: "Fuzzy frontend | Software blog"};

  expect(createBlogPostContentSchema({image}).parse(post)).toMatchObject({
    dateModified: new Date("2026-11-06"),
    homepageOrder: 2,
    seoTitle: "Fuzzy frontend | Software blog",
  });
});

it("rejects blank text", () => {
  expect(createBlogPostContentSchema({image}).safeParse({...validPost, summary: " "}).success).toBe(false);
});

it("rejects an empty topic list", () => {
  expect(createBlogPostContentSchema({image}).safeParse({...validPost, topics: []}).success).toBe(false);
});

it("rejects an unparseable date", () => {
  expect(createBlogPostContentSchema({image}).safeParse({...validPost, datePublished: "not a date"}).success).toBe(
    false,
  );
});

it("rejects a non-positive or fractional homepage order", () => {
  expect(createBlogPostContentSchema({image}).safeParse({...validPost, homepageOrder: 0}).success).toBe(false);
  expect(createBlogPostContentSchema({image}).safeParse({...validPost, homepageOrder: 1.5}).success).toBe(false);
});

it("rejects a modified date earlier than the published date", () => {
  expect(createBlogPostContentSchema({image}).safeParse({...validPost, dateModified: "2026-11-04"}).success).toBe(
    false,
  );
});

it("accepts a diagram with desktop and phone compositions and alt text", () => {
  expect(createBlogPostContentSchema({image}).parse({...validPost, diagram: validDiagram})).toMatchObject({
    diagram: validDiagram,
  });
});

it("rejects a diagram without its phone composition", () => {
  const diagram = {image: validDiagram.image, alt: validDiagram.alt};

  expect(createBlogPostContentSchema({image}).safeParse({...validPost, diagram}).success).toBe(false);
});

it("preserves optional dark diagram compositions", () => {
  const diagram = {
    ...validDiagram,
    imageDark: {...validDiagram.image, src: "/flow-dark.png"},
    mobileImageDark: {...validDiagram.mobileImage, src: "/flow-mobile-dark.png"},
  };

  expect(createBlogPostContentSchema({image}).parse({...validPost, diagram})).toMatchObject({diagram});
});

it("rejects a diagram with blank alt text", () => {
  const diagram = {...validDiagram, alt: " "};

  expect(createBlogPostContentSchema({image}).safeParse({...validPost, diagram}).success).toBe(false);
});
