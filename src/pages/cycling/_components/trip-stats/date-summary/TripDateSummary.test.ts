import {expect, it} from "vitest";

import {formatTripDateSummary} from "./TripDateSummary";

it("uses days for a short trip", () => {
  expect(formatTripDateSummary(new Date("2025-06-30"), new Date("2025-07-02"))).toEqual({
    duration: "3 days",
    months: "June–July 2025",
  });
});

it("rounds a seven-day trip to one week", () => {
  expect(formatTripDateSummary(new Date("2024-05-11"), new Date("2024-05-17"))).toEqual({
    duration: "1 week",
    months: "May 2024",
  });
});

it("rounds a trip of several weeks to the nearest week", () => {
  expect(formatTripDateSummary(new Date("2023-08-17"), new Date("2023-09-11"))).toEqual({
    duration: "4 weeks",
    months: "August–September 2023",
  });
});

it("rounds a long trip to the nearest month", () => {
  expect(formatTripDateSummary(new Date("2026-06-27"), new Date("2026-08-23"))).toEqual({
    duration: "2 months",
    months: "June–August 2026",
  });
});

it("includes both years when a trip crosses a year boundary", () => {
  expect(formatTripDateSummary(new Date("2024-12-29"), new Date("2025-01-26"))).toEqual({
    duration: "4 weeks",
    months: "December 2024–January 2025",
  });
});
