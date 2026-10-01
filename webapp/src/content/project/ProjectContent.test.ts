import type {SchemaContext} from "astro:content";
import {z} from "astro/zod";
import {expect, it} from "vitest";

import {createProjectContentSchema} from "./ProjectContent";

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

const validProject = {
  title: "Janggi",
  sortOrder: 1,
  summary: "A carefully engineered Korean chess application.",
  datePublished: "2024-01-15",
  technologies: ["TypeScript", "React"],
  repositoryUrl: "https://github.com/neil-armstrong-fig/janggi",
  liveUrl: "https://janggi.neilarmstrong.dev/",
  heroImage: {src: "/janggi.webp", width: 1600, height: 900, format: "webp"},
  heroAlt: "A Janggi game in progress",
  featured: true,
  draft: false,
  seoDescription: "How I designed and built an offline-capable Korean chess application.",
};

it("parses project dates and web URLs into their runtime types", () => {
  const result = createProjectContentSchema({image}).parse(validProject);

  expect(result.datePublished).toEqual(new Date("2024-01-15"));
  expect(result.repositoryUrl).toEqual(new URL(validProject.repositoryUrl));
  expect(result.liveUrl).toEqual(new URL(validProject.liveUrl));
});

it("rejects a project without technologies or meaningful image alt text", () => {
  const result = createProjectContentSchema({image}).safeParse({...validProject, technologies: [], heroAlt: " "});

  expect(result.success).toBe(false);
});

it("rejects a blank live-site link label", () => {
  const result = createProjectContentSchema({image}).safeParse({...validProject, liveLabel: " "});

  expect(result.success).toBe(false);
});

it("rejects a project without a positive whole-number sort order", () => {
  const result = createProjectContentSchema({image}).safeParse({...validProject, sortOrder: 0});

  expect(result.success).toBe(false);
});

it("rejects a blank card title", () => {
  const result = createProjectContentSchema({image}).safeParse({...validProject, cardTitle: " "});

  expect(result.success).toBe(false);
});
