import {expect, it} from "vitest";

import {formatTripDistance} from "./TripDistance";

it("formats kilometres and miles as rounded whole numbers", () => {
  expect(formatTripDistance(100)).toEqual({metric: "100 km", imperial: "62 mi"});
});
