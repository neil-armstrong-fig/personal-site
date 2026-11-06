import {expect, it} from "vitest";

import {formatPostDate} from "./FormatPostDate";

it("formats a date as a UK long date", () => {
  expect(formatPostDate(new Date("2026-11-05"))).toBe("5 November 2026");
});

it("uses the UTC day, so the build machine's time zone cannot move it", () => {
  expect(formatPostDate(new Date("2026-11-05T23:30:00Z"))).toBe("5 November 2026");
});
