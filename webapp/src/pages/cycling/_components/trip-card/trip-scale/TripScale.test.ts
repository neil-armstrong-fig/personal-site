import {expect, it} from "vitest";

import {describeTripScale} from "./TripScale";

it("labels a chaptered trip by its parts and marks it major", () => {
  const scale = describeTripScale({startDate: new Date("2025-03-29"), endDate: new Date("2025-04-27"), parts: 10});

  expect(scale).toEqual({label: "10 parts", major: true});
});

it("marks an unchaptered trip of four weeks or more as major, counting both end dates", () => {
  const scale = describeTripScale({startDate: new Date("2026-06-27"), endDate: new Date("2026-08-23"), parts: 1});

  expect(scale).toEqual({label: "58 days", major: true});
});

it("leaves a shorter single-page trip minor", () => {
  const scale = describeTripScale({startDate: new Date("2023-08-17"), endDate: new Date("2023-09-11"), parts: 1});

  expect(scale).toEqual({label: "26 days", major: false});
});

it("treats exactly 28 days as major and 27 as minor", () => {
  const start = new Date("2025-01-01");

  expect(describeTripScale({startDate: start, endDate: new Date("2025-01-28"), parts: 1}).major).toBe(true);
  expect(describeTripScale({startDate: start, endDate: new Date("2025-01-27"), parts: 1}).major).toBe(false);
});
