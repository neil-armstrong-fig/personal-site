import {expect, it, vi} from "vitest";

import {headWithRetry} from "./HeadWithRetry";

const url = "https://media.neilarmstrong.dev/trips/a/one.mp4";

it("returns the response on the first successful attempt", async () => {
  const fetchFn = vi.fn().mockResolvedValue(new Response(null, {status: 200}));

  const response = await headWithRetry(url, fetchFn, {attempts: 3, delayMs: 0});

  expect(response.status).toBe(200);
  expect(fetchFn).toHaveBeenCalledTimes(1);
});

it("retries after a thrown network error", async () => {
  const fetchFn = vi
    .fn()
    .mockRejectedValueOnce(new TypeError("fetch failed"))
    .mockResolvedValue(new Response(null, {status: 200}));

  const response = await headWithRetry(url, fetchFn, {attempts: 3, delayMs: 0});

  expect(response.status).toBe(200);
  expect(fetchFn).toHaveBeenCalledTimes(2);
});

it("does not retry an HTTP error response", async () => {
  const fetchFn = vi.fn().mockResolvedValue(new Response(null, {status: 404}));

  const response = await headWithRetry(url, fetchFn, {attempts: 3, delayMs: 0});

  expect(response.status).toBe(404);
  expect(fetchFn).toHaveBeenCalledTimes(1);
});

it("names the url and the cause once every attempt has thrown", async () => {
  const fetchFn = vi.fn().mockRejectedValue(new TypeError("fetch failed"));

  await expect(headWithRetry(url, fetchFn, {attempts: 3, delayMs: 0})).rejects.toThrow(
    `${url} could not be reached after 3 attempts: fetch failed`,
  );
  expect(fetchFn).toHaveBeenCalledTimes(3);
});
