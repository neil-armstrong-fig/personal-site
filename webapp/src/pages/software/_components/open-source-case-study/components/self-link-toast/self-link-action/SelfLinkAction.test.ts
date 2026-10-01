import {expect, it} from "vitest";

import {CONFIRM_WINDOW_MS, nextSelfLinkAction} from "./SelfLinkAction";

it("asks on the first click", () => {
  expect(nextSelfLinkAction(undefined, 0)).toBe("ask");
});

it("pushes on a second click inside the window", () => {
  expect(nextSelfLinkAction("ask", CONFIRM_WINDOW_MS)).toBe("push");
});

it("opens the link on a third click inside the window", () => {
  expect(nextSelfLinkAction("push", 1000)).toBe("open");
});

it("starts again when the window has passed", () => {
  expect(nextSelfLinkAction("ask", CONFIRM_WINDOW_MS + 1)).toBe("ask");
  expect(nextSelfLinkAction("push", CONFIRM_WINDOW_MS + 1)).toBe("ask");
});

it("starts again after the link has opened", () => {
  expect(nextSelfLinkAction("open", 100)).toBe("ask");
});
