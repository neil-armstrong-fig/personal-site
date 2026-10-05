import {expect, it, vi} from "vitest";

import {verifyTurnstile} from "./VerifyTurnstile";

vi.mock("@src/env/WorkerEnvironment", () => ({workerEnvironment: {TURNSTILE_SECRET: "s3cret"}}));

it("posts the secret, token and visitor address to Cloudflare's verification endpoint", async () => {
  const fetchSpy = stubFetch(async () => Response.json({success: true}));

  await verifyTurnstile("tok", "203.0.113.9");

  expect(fetchSpy).toHaveBeenCalledTimes(1);
  const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];

  expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
  expect(init.method).toBe("POST");
  expect(Object.fromEntries(new URLSearchParams(init.body as string))).toEqual({
    secret: "s3cret",
    response: "tok",
    remoteip: "203.0.113.9",
  });
});

it("passes when Cloudflare says the token is valid", async () => {
  stubFetch(async () => Response.json({success: true}));

  expect(await verifyTurnstile("t", undefined)).toBe("verified");
});

it("fails when Cloudflare rejects the token", async () => {
  stubFetch(async () => Response.json({success: false, "error-codes": ["invalid-input-response"]}));

  expect(await verifyTurnstile("t", undefined)).toBe("rejected");
});

it("reports unavailable when Cloudflare rejects the Worker configuration or has an internal error", async () => {
  stubFetch(async () => Response.json({success: false, "error-codes": ["invalid-input-secret"]}));
  expect(await verifyTurnstile("t", undefined)).toBe("unavailable");

  stubFetch(async () => Response.json({success: false, "error-codes": ["internal-error"]}));
  expect(await verifyTurnstile("t", undefined)).toBe("unavailable");
});

it("reports unavailable when the verification request errors, answers badly or is not JSON", async () => {
  stubFetch(async () => {
    throw new Error("network down");
  });
  expect(await verifyTurnstile("t", undefined)).toBe("unavailable");

  stubFetch(async () => new Response("oops", {status: 500}));
  expect(await verifyTurnstile("t", undefined)).toBe("unavailable");

  stubFetch(async () => new Response("<html>", {status: 200}));
  expect(await verifyTurnstile("t", undefined)).toBe("unavailable");
});

it("reports unavailable when Cloudflare returns no verification decision", async () => {
  stubFetch(async () => Response.json({}));

  expect(await verifyTurnstile("t", undefined)).toBe("unavailable");
});

it("does not send a remote address it does not have", async () => {
  const fetchSpy = stubFetch(async () => Response.json({success: true}));

  await verifyTurnstile("t", undefined);

  const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];

  expect(new URLSearchParams(init.body as string).has("remoteip")).toBe(false);
});

// Replaces the global `fetch` for the current test; vitest restores it afterwards (`restoreMocks`).
function stubFetch(respond: () => Promise<Response>): ReturnType<typeof vi.spyOn> {
  return vi.spyOn(globalThis, "fetch").mockImplementation(respond);
}
