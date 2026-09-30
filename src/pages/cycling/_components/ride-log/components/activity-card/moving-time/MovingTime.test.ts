import {expect, it} from "vitest";

import {formatMovingTime} from "./MovingTime";

it("formats moving time as hours and minutes", () => {
  expect(formatMovingTime(14_508)).toBe("4 h 02 min");
  expect(formatMovingTime(3_600)).toBe("1 h 00 min");
  expect(formatMovingTime(59)).toBe("0 h 01 min");
});
