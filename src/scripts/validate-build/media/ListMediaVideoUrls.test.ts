import {expect, it} from "vitest";

import {listMediaVideoUrls} from "./ListMediaVideoUrls";

it("lists each clip served from the media origin once, ignoring local and other clips", () => {
  const html = `
    <video src="https://media.neilarmstrong.dev/trips/a/one.mp4"></video>
    <video src="https://media.neilarmstrong.dev/trips/a/one.mp4"></video>
    <video src="https://media.neilarmstrong.dev/trips/a/two.mp4"></video>
    <video src="/trips/a/local.mp4"></video>
    <video src="https://elsewhere.example/three.mp4"></video>
    <img src="https://media.neilarmstrong.dev/trips/a/poster.jpg" />`;

  expect(listMediaVideoUrls(html)).toEqual([
    "https://media.neilarmstrong.dev/trips/a/one.mp4",
    "https://media.neilarmstrong.dev/trips/a/two.mp4",
  ]);
});
