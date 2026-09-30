import type {SchemaContext} from "astro:content";
import {z} from "astro/zod";
import {expect, it} from "vitest";

import {createTripChapterContentSchema} from "./TripChapterContent";

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

const validChapter = {
  title: "Tokyo to Lake Biwa",
  order: 2,
  startDate: "2025-03-31",
  endDate: "2025-04-05",
  coverImage: {src: "/fuji.webp", width: 1600, height: 900, format: "webp"},
  coverAlt: "Mount Fuji's snow-capped peak rising above the hills along the coastline",
  seoDescription: "Escaping Tokyo for Mount Fuji, a blown tyre and Ichi Coffee, then Lake Biwa.",
  draft: false,
};

it("parses chapter dates into their runtime type", () => {
  const result = createTripChapterContentSchema({image}).parse(validChapter);

  expect(result.startDate).toEqual(new Date("2025-03-31"));
  expect(result.endDate).toEqual(new Date("2025-04-05"));
});

it("rejects a chapter whose end date is before its start date", () => {
  const result = createTripChapterContentSchema({image}).safeParse({...validChapter, endDate: "2025-03-30"});

  expect(result.success).toBe(false);
});

it("rejects a non-positive chapter order", () => {
  const result = createTripChapterContentSchema({image}).safeParse({...validChapter, order: 0});

  expect(result.success).toBe(false);
});

it("rejects blank chapter text", () => {
  const result = createTripChapterContentSchema({image}).safeParse({...validChapter, title: "  "});

  expect(result.success).toBe(false);
});
