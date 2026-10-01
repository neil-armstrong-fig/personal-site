import {expect, it} from "vitest";

import {isTripVideoPath} from "./IsTripVideoPath";

it("recognises a root-absolute MP4", () => {
  expect(isTripVideoPath("/trips/porto-to-faro/coast.mp4")).toBe(true);
});

it("recognises an upper-case extension", () => {
  expect(isTripVideoPath("/trips/porto-to-faro/COAST.MP4")).toBe(true);
});

it("leaves images alone", () => {
  expect(isTripVideoPath("./_assets/coast.jpg")).toBe(false);
});

it("leaves a relative MP4 alone so a stray path fails loudly rather than shipping unprocessed", () => {
  expect(isTripVideoPath("./_assets/coast.mp4")).toBe(false);
});
