import {expect, it} from "vitest";

import {applyDeferredPoster} from "./ApplyDeferredPoster";

it("moves the deferred poster URL onto the video and clears the data attribute", () => {
  const video = {dataset: {poster: "/trips/porto-to-faro/coast.jpg"}, poster: ""};

  applyDeferredPoster(video);

  expect(video.poster).toBe("/trips/porto-to-faro/coast.jpg");
  expect(video.dataset.poster).toBeUndefined();
});

it("leaves a video without a deferred poster untouched", () => {
  const video = {dataset: {}, poster: "/existing.jpg"};

  applyDeferredPoster(video);

  expect(video.poster).toBe("/existing.jpg");
});
