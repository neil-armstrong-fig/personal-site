import {expect, it} from "vitest";

import {corsHeaders} from "./CorsHeaders";

const allowedOrigin = "https://neilarmstrong.dev";

it("allows the configured origin and tells caches the answer depends on it", () => {
  const headers = corsHeaders(allowedOrigin, allowedOrigin);

  expect(headers.get("Access-Control-Allow-Origin")).toBe(allowedOrigin);
  expect(headers.get("Vary")).toBe("Origin");
});

it("grants nothing to any other origin", () => {
  expect(corsHeaders("https://evil.example", allowedOrigin).has("Access-Control-Allow-Origin")).toBe(false);
});

it("does not treat a lookalike origin as the allowed one", () => {
  expect(corsHeaders("https://neilarmstrong.dev.evil.example", allowedOrigin).has("Access-Control-Allow-Origin")).toBe(
    false,
  );
});

it("grants nothing when the request carries no origin", () => {
  expect(corsHeaders(undefined, allowedOrigin).has("Access-Control-Allow-Origin")).toBe(false);
});
