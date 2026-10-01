import type {ImageMetadata} from "astro";
import type {SchemaContext} from "astro:content";
import {z} from "astro/zod";

interface TripContent {
  title: string;
  summary: string;
  startDate: Date;
  endDate?: Date;
  locations: string[];
  countries: string[];
  durationDays?: number;
  distanceKm?: number;
  elevationMetres?: number;
  coverImage: ImageMetadata;
  coverAlt: string;
  stravaUrls?: URL[];
  featured: boolean;
  draft: boolean;
  comingSoon: boolean;
  dateModified?: Date;
  seoTitle?: string;
  seoDescription: string;
  // The overview's own heading and contents-list label when the trip has chapters (e.g. "Arrival in Tokyo"),
  // since the prologue kept on the overview page has no chapter entry of its own to hold a distinct title.
  firstPartTitle?: string;
}

export function createTripContentSchema({image}: SchemaContext): z.ZodType<TripContent, unknown> {
  const requiredText = z.string().trim().min(1);
  const webUrl = z.url({protocol: /^https?$/}).transform(value => new URL(value));

  return z
    .object({
      title: requiredText,
      summary: requiredText,
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      locations: z.array(requiredText).min(1),
      countries: z.array(requiredText).min(1),
      durationDays: z.number().int().positive().optional(),
      distanceKm: z.number().positive().optional(),
      elevationMetres: z.number().positive().optional(),
      coverImage: image(),
      coverAlt: requiredText,
      stravaUrls: z.array(webUrl).min(1).optional(),
      featured: z.boolean(),
      draft: z.boolean(),
      comingSoon: z.boolean().default(false),
      dateModified: z.coerce.date().optional(),
      seoTitle: requiredText.optional(),
      seoDescription: requiredText,
      firstPartTitle: requiredText.optional(),
    })
    .refine(trip => trip.endDate === undefined || trip.endDate >= trip.startDate, {
      message: "End date must be on or after the start date.",
      path: ["endDate"],
    });
}
