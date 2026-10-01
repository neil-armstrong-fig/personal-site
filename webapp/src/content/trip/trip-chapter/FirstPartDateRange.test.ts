import {expect, it} from "vitest";

import {firstPartDateRange} from "./FirstPartDateRange";

it("ends the day before the first chapter begins", () => {
  const trip = {startDate: new Date("2025-03-29"), endDate: new Date("2025-04-27")};
  const chapters = [{startDate: new Date("2025-03-31")}, {startDate: new Date("2025-04-07")}];

  expect(firstPartDateRange(trip, chapters)).toEqual({
    startDate: new Date("2025-03-29"),
    endDate: new Date("2025-03-30"),
  });
});

it("falls back to the whole trip's own range when there are no chapters", () => {
  const trip = {startDate: new Date("2025-03-29"), endDate: new Date("2025-04-27")};

  expect(firstPartDateRange(trip, [])).toEqual(trip);
});
