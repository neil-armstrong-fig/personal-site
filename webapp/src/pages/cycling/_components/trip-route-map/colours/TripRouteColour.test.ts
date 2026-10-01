import {expect, it} from "vitest";

import {tripRouteColour} from "./TripRouteColour";

it("returns deterministic, distinct golden-angle colours for adjacent cycling activities", () => {
  expect(tripRouteColour(0)).toBe("hsl(188 62% 42%)");
  expect(tripRouteColour(1)).toBe("hsl(325.508 62% 42%)");
  expect(tripRouteColour(2)).toBe("hsl(103.016 62% 42%)");
  expect(tripRouteColour(45)).toBe(tripRouteColour(45));
});
