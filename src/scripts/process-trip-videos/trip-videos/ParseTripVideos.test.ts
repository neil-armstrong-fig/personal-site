import {expect, it} from "vitest";

import {parseTripVideos} from "./ParseTripVideos";

const video = {source: "dirt track.mp4", name: "dirt-track-ride", alt: "Riding a grassy track"};

it("returns the videos in manifest order with audio enabled by default", () => {
  const second = {source: "fog.mp4", name: "fog-ride", alt: "Riding through fog"};

  expect(parseTripVideos({videos: [video, second]})).toEqual([
    {...video, muteAudio: false},
    {...second, muteAudio: false},
  ]);
});

it("allows one video's audio to be stripped", () => {
  expect(parseTripVideos({videos: [{...video, muteAudio: true}]})).toEqual([{...video, muteAudio: true}]);
});

it("rejects a manifest with no videos", () => {
  expect(() => parseTripVideos({videos: []})).toThrow();
});

it("rejects a manifest without a videos list", () => {
  expect(() => parseTripVideos({photos: [video]})).toThrow();
});

it("rejects blank alt text", () => {
  expect(() => parseTripVideos({videos: [{...video, alt: " "}]})).toThrow();
});

it("rejects a source that is not an MP4", () => {
  expect(() => parseTripVideos({videos: [{...video, source: "dirt track.mov"}]})).toThrow(/mp4/i);
});

it("rejects duplicate output names", () => {
  expect(() => parseTripVideos({videos: [video, {...video, source: "other.mp4"}]})).toThrow(/duplicate/i);
});
