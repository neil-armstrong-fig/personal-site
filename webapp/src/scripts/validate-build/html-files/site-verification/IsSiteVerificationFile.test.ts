import {expect, it} from "vitest";

import {isSiteVerificationFile} from "./IsSiteVerificationFile";

it("recognises the file Naver asks to be served to prove ownership", () => {
  expect(isSiteVerificationFile("naver2656f66be8a45a518ae30bce670acbd9.html")).toBe(true);
});

it("does not mistake a page for one", () => {
  expect(isSiteVerificationFile("index.html")).toBe(false);
  expect(isSiteVerificationFile("404.html")).toBe(false);
  expect(isSiteVerificationFile("naver.html")).toBe(false);
});

it("does not exempt a page that merely starts the same way", () => {
  expect(isSiteVerificationFile("naver2656f66be8a45a518ae30bce670acbd9-about.html")).toBe(false);
  expect(isSiteVerificationFile("naver2656f66be8a45a518ae30bce670acbd9.html.html")).toBe(false);
});
