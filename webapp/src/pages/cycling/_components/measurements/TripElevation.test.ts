import {expect, it} from "vitest";

import {formatTripElevation} from "./TripElevation";

it("formats metres and feet as rounded whole numbers", () => {
  expect(formatTripElevation(1000)).toEqual({metric: "1,000 m", imperial: "3,281 ft"});
});
