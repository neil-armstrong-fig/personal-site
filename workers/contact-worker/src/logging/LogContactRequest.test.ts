import {expect, it, vi} from "vitest";

import {logContactRequest} from "./LogContactRequest";

it("writes an expected outcome as a structured informational event", () => {
  const logged = vi.spyOn(console, "info").mockImplementation(() => undefined);

  logContactRequest({outcome: "honeypot_tripped", method: "POST", status: 200});

  expect(logged).toHaveBeenCalledExactlyOnceWith({
    event: "contact_request",
    outcome: "honeypot_tripped",
    method: "POST",
    status: 200,
  });
});

it("writes a Turnstile outage as a structured warning", () => {
  const logged = vi.spyOn(console, "warn").mockImplementation(() => undefined);

  logContactRequest({outcome: "turnstile_unavailable", method: "POST", status: 400});

  expect(logged).toHaveBeenCalledExactlyOnceWith({
    event: "contact_request",
    outcome: "turnstile_unavailable",
    method: "POST",
    status: 400,
  });
});

it("writes an internal failure as a structured error without an exception message", () => {
  const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);

  logContactRequest({outcome: "delivery_failed", method: "POST", status: 502, errorName: "TypeError"});

  expect(logged).toHaveBeenCalledExactlyOnceWith({
    event: "contact_request",
    outcome: "delivery_failed",
    method: "POST",
    status: 502,
    errorName: "TypeError",
  });
});
