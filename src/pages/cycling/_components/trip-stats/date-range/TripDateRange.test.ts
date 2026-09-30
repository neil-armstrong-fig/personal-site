import {expect, it} from "vitest";

import {formatTripDateRange} from "./TripDateRange";

it("formats a trip within one month without repeating the month or year", () => {
  expect(formatTripDateRange(new Date("2024-05-11"), new Date("2024-05-17"))).toBe("11–17 May 2024");
});

it("formats a trip across months in the same year", () => {
  expect(formatTripDateRange(new Date("2025-03-29"), new Date("2025-04-27"))).toBe("29 March–27 April 2025");
});

it("formats a trip across years", () => {
  expect(formatTripDateRange(new Date("2024-12-29"), new Date("2025-01-26"))).toBe("29 December 2024–26 January 2025");
});

it("formats a trip with no end date as one exact date", () => {
  expect(formatTripDateRange(new Date("2025-03-29"))).toBe("29 March 2025");
});
