import {expect, it} from "vitest";

import {buildTripVideoArguments} from "./BuildTripVideoArguments";

const encode = buildTripVideoArguments({source: "in.mp4", destination: "out.mp4"});
const mutedEncode = buildTripVideoArguments({source: "in.mp4", destination: "out.mp4", muteAudio: true});

it("reads the source and writes the destination last", () => {
  expect(encode.slice(encode.indexOf("-i"), encode.indexOf("-i") + 2)).toEqual(["-i", "in.mp4"]);
  expect(encode.at(-1)).toBe("out.mp4");
});

it("drops all global metadata, including the GPS location tag", () => {
  const index = encode.indexOf("-map_metadata");

  expect(encode[index + 1]).toBe("-1");
});

it("drops chapters", () => {
  const index = encode.indexOf("-map_chapters");

  expect(encode[index + 1]).toBe("-1");
});

it("encodes H.264 with AAC audio, keeping the sound", () => {
  expect(encode).toContain("libx264");
  expect(encode).toContain("aac");
  expect(encode).not.toContain("-an");
});

it("can strip the audio from a specific clip", () => {
  expect(mutedEncode).toContain("-an");
  expect(mutedEncode).not.toContain("aac");
});

it("moves the index to the front so playback can start before the download ends", () => {
  expect(encode).toContain("+faststart");
});

it("limits the longest edge to 1280 px without enlarging", () => {
  const filter = encode[encode.indexOf("-vf") + 1];

  expect(filter).toContain("1280");
  expect(filter).toContain("min(");
});

it("overwrites without prompting", () => {
  expect(encode).toContain("-y");
});

it("halves 60 fps phone footage to 30 fps to keep the files small", () => {
  const index = encode.indexOf("-r");

  expect(encode[index + 1]).toBe("30");
});
