import {expect, it} from "vitest";

import {filterByTripChapterDateRange} from "./FilterByTripChapterDateRange";

const entries = [
  {date: "2025-04-06", label: "before"},
  {date: "2025-04-07", label: "first day"},
  {date: "2025-04-08", label: "last day"},
  {date: "2025-04-09", label: "after"},
];

it("keeps only entries within the chapter's inclusive date range", () => {
  const result = filterByTripChapterDateRange(entries, {
    startDate: new Date("2025-04-07"),
    endDate: new Date("2025-04-08"),
  });

  expect(result.map(entry => entry.label)).toEqual(["first day", "last day"]);
});

it("treats a chapter with no end date as a single day", () => {
  const result = filterByTripChapterDateRange(entries, {startDate: new Date("2025-04-07")});

  expect(result.map(entry => entry.label)).toEqual(["first day"]);
});

it("returns an empty array when nothing falls in range", () => {
  const result = filterByTripChapterDateRange(entries, {
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-05-02"),
  });

  expect(result).toEqual([]);
});
