import {expect, it} from "vitest";

import {sortNewestFirst} from "./SortNewestFirst";

it("sorts entries newest first without mutating the input", () => {
  const older = {id: "older", date: new Date("2024-01-01")};
  const newer = {id: "newer", date: new Date("2025-06-01")};
  const entries = [older, newer];

  expect(sortNewestFirst(entries, entry => entry.date)).toEqual([newer, older]);
  expect(entries).toEqual([older, newer]);
});
