import {expect, it} from "vitest";

import {formatActivityDate} from "./ActivityDate";

it("formats an ISO calendar date without shifting time zones", () => {
  expect(formatActivityDate("2023-08-18")).toBe("18 Aug 2023");
  expect(formatActivityDate("2024-01-01")).toBe("1 Jan 2024");
});
