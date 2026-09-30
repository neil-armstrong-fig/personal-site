import type {ImageMetadata} from "astro";
import type {SchemaContext} from "astro:content";
import {z} from "astro/zod";

interface TripChapterContent {
  title: string;
  order: number;
  startDate: Date;
  endDate?: Date;
  coverImage: ImageMetadata;
  coverAlt: string;
  seoDescription: string;
  draft: boolean;
}

export function createTripChapterContentSchema({image}: SchemaContext): z.ZodType<TripChapterContent, unknown> {
  const requiredText = z.string().trim().min(1);

  return z
    .object({
      title: requiredText,
      order: z.number().int().positive(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      coverImage: image(),
      coverAlt: requiredText,
      seoDescription: requiredText,
      draft: z.boolean(),
    })
    .refine(chapter => chapter.endDate === undefined || chapter.endDate >= chapter.startDate, {
      message: "End date must be on or after the start date.",
      path: ["endDate"],
    });
}
