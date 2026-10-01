import {describe, expect, it} from "vitest";

import {assertLinkSpacing} from "@src/scripts/validate-build/html/AssertLinkSpacing";

describe("assertLinkSpacing", () => {
  it("accepts a link with a space either side", () => {
    expect(() => assertLinkSpacing('<p>I won an <a href="/x/">award</a> today.</p>', "/about/")).not.toThrow();
  });

  it("accepts a link directly after an opening tag or punctuation that wants no space", () => {
    expect(() => assertLinkSpacing('<p><a href="/x/">award</a>, (<a href="/y/">y</a>).</p>', "/about/")).not.toThrow();
  });

  it("rejects a word glued to the start of a link", () => {
    expect(() => assertLinkSpacing('<p>I won an<a href="/x/">award</a></p>', "/about/")).toThrow(
      "/about/ has a link with no space before it: n<a href=",
    );
  });

  it("rejects a word glued to the end of a link", () => {
    expect(() => assertLinkSpacing('<p><a href="/x/">award</a>with prizes</p>', "/about/")).toThrow(
      "/about/ has a link with no space after it: </a>with",
    );
  });
});
