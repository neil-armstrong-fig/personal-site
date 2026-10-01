import type {SchemaContext} from "astro:content";
import {z} from "astro/zod";
import {expect, it} from "vitest";

import {createTripContentSchema} from "./TripContent";

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

const stravaUrl = "https://www.strava.com/activities/123";

const validTrip = {
  title: "A long road north",
  summary: "A multi-day ride through changing landscapes.",
  startDate: "2025-05-10",
  endDate: "2025-05-13",
  locations: ["Belfast"],
  countries: ["Northern Ireland"],
  durationDays: 4,
  distanceKm: 420.5,
  elevationMetres: 3800,
  coverImage: {src: "/road.webp", width: 1600, height: 900, format: "webp"},
  coverAlt: "A quiet road crossing green hills",
  stravaUrls: [stravaUrl],
  featured: true,
  draft: false,
  seoDescription: "A four-day cycle tour through Northern Ireland.",
};

it("parses trip dates and Strava URLs into their runtime types", () => {
  const result = createTripContentSchema({image}).parse(validTrip);

  expect(result.startDate).toEqual(new Date("2025-05-10"));
  expect(result.endDate).toEqual(new Date("2025-05-13"));
  expect(result.stravaUrls).toEqual([new URL(stravaUrl)]);
});

it("preserves an explicit coming-soon story status", () => {
  const result = createTripContentSchema({image}).parse({...validTrip, comingSoon: true});

  expect(result.comingSoon).toBe(true);
});

it("preserves an explicit first-part title", () => {
  const result = createTripContentSchema({image}).parse({...validTrip, firstPartTitle: "Arrival in Tokyo"});

  expect(result.firstPartTitle).toBe("Arrival in Tokyo");
});

it("preserves an explicit card image with its alt text", () => {
  const cardImage = {src: "/bridge.webp", width: 1600, height: 1200, format: "webp"};
  const result = createTripContentSchema({image}).parse({...validTrip, cardImage, cardAlt: "A stone bridge"});

  expect(result.cardImage).toEqual(cardImage);
  expect(result.cardAlt).toBe("A stone bridge");
});

it("rejects a card image without alt text", () => {
  const cardImage = {src: "/bridge.webp", width: 1600, height: 1200, format: "webp"};
  const result = createTripContentSchema({image}).safeParse({...validTrip, cardImage});

  expect(result.success).toBe(false);
});

it("rejects a trip whose end date is before its start date", () => {
  const result = createTripContentSchema({image}).safeParse({...validTrip, endDate: "2025-05-09"});

  expect(result.success).toBe(false);
});

it("rejects non-positive measurements", () => {
  const result = createTripContentSchema({image}).safeParse({
    ...validTrip,
    distanceKm: 0,
  });

  expect(result.success).toBe(false);
});
