import {expect, it} from "vitest";

import {defaultRouteSelectionLabel} from "./DefaultRouteSelectionLabel";

it("describes the whole trip when nothing is highlighted", () => {
  expect(defaultRouteSelectionLabel({mappedRouteCount: 35, highlightedCount: 0})).toBe("All 35 mapped routes");
});

it("describes just the highlighted part when it has more than one route", () => {
  expect(defaultRouteSelectionLabel({mappedRouteCount: 35, highlightedCount: 6})).toBe("This part's 6 routes");
});

it("uses the singular for a single highlighted route", () => {
  expect(defaultRouteSelectionLabel({mappedRouteCount: 35, highlightedCount: 1})).toBe("This part's 1 route");
});
