import {beforeEach, expect, it, vi} from "vitest";
import type {Mock} from "vitest";

import type {ContactMessage} from "@personal-site/shared/contact/types/ContactMessage";
import type {ContactResponse} from "@personal-site/shared/contact/types/ContactResponse";

import {handleContactRequest} from "./HandleContactRequest";
import {deliverContactMessage} from "./mail/DeliverContactMessage";
import {verifyTurnstile} from "./turnstile/VerifyTurnstile";

const allowedOrigin = "https://neilarmstrong.dev";

vi.mock("@src/env/WorkerEnvironment", () => ({workerEnvironment: {ALLOWED_ORIGIN: "https://neilarmstrong.dev"}}));
vi.mock("./turnstile/VerifyTurnstile", () => ({verifyTurnstile: vi.fn()}));
vi.mock("./mail/DeliverContactMessage", () => ({deliverContactMessage: vi.fn()}));

interface FakeServices {
  verifyHuman: Mock<typeof verifyTurnstile>;
  deliver: Mock<typeof deliverContactMessage>;
}

// Every test starts with a human-verified visitor and working mail; a test overrides what it needs.
beforeEach(() => {
  fakeServices();
});

it("delivers a valid, human-verified message and answers ok", async () => {
  const services = fakeServices();

  const response = await handleContactRequest(post(validForm()));

  expect(response.status).toBe(200);
  expect(await json(response)).toEqual({ok: true});
  expect(services.deliver).toHaveBeenCalledWith({
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Hello.",
  } satisfies ContactMessage);
  expect(services.verifyHuman).toHaveBeenCalledWith("good-token", "203.0.113.9");
});

it("lets the allowed origin read the answer", async () => {
  const response = await handleContactRequest(post(validForm()));

  expect(response.headers.get("Access-Control-Allow-Origin")).toBe(allowedOrigin);
  expect(response.headers.get("Content-Type")).toContain("application/json");
});

it("reports each invalid field and neither verifies nor delivers", async () => {
  const services = fakeServices();
  const form = validForm();
  form.set("email", "not-an-email");
  form.set("message", "");

  const response = await handleContactRequest(post(form));

  expect(response.status).toBe(400);
  expect(await json(response)).toEqual({ok: false, invalidFields: ["email", "message"]});
  expect(services.verifyHuman).not.toHaveBeenCalled();
  expect(services.deliver).not.toHaveBeenCalled();
});

it("quietly pretends to succeed when the honeypot is filled, without verifying or delivering", async () => {
  const services = fakeServices();
  const form = validForm();
  form.set("website", "http://spam.example");

  const response = await handleContactRequest(post(form));

  expect(response.status).toBe(200);
  expect(await json(response)).toEqual({ok: true});
  expect(services.verifyHuman).not.toHaveBeenCalled();
  expect(services.deliver).not.toHaveBeenCalled();
});

it("rejects a missing human-check token", async () => {
  const services = fakeServices();
  const form = validForm();
  form.delete("cf-turnstile-response");

  const response = await handleContactRequest(post(form));

  expect(response.status).toBe(400);
  expect(await json(response)).toEqual({ok: false});
  expect(services.verifyHuman).not.toHaveBeenCalled();
  expect(services.deliver).not.toHaveBeenCalled();
});

it("rejects a token Cloudflare does not accept", async () => {
  const services = fakeServices({verifyHuman: vi.fn(async () => false)});

  const response = await handleContactRequest(post(validForm()));

  expect(response.status).toBe(400);
  expect(await json(response)).toEqual({ok: false});
  expect(services.deliver).not.toHaveBeenCalled();
});

it("answers 502 when delivery fails", async () => {
  fakeServices({
    deliver: vi.fn(async () => {
      throw new Error("mail down");
    }),
  });

  const response = await handleContactRequest(post(validForm()));

  expect(response.status).toBe(502);
  expect(await json(response)).toEqual({ok: false});
});

it("refuses a request from another origin", async () => {
  const services = fakeServices();

  const response = await handleContactRequest(post(validForm(), "https://evil.example"));

  expect(response.status).toBe(403);
  expect(response.headers.has("Access-Control-Allow-Origin")).toBe(false);
  expect(services.deliver).not.toHaveBeenCalled();
});

it("answers a preflight for the allowed origin and nothing else", async () => {
  const allowed = await handleContactRequest(preflight(allowedOrigin));
  const other = await handleContactRequest(preflight("https://evil.example"));

  expect(allowed.status).toBe(204);
  expect(allowed.headers.get("Access-Control-Allow-Methods")).toBe("POST");
  expect(allowed.headers.get("Access-Control-Allow-Origin")).toBe(allowedOrigin);
  expect(other.status).toBe(403);
});

it("refuses methods other than POST", async () => {
  const response = await handleContactRequest(new Request("https://contact.neilarmstrong.dev/"));

  expect(response.status).toBe(405);
  expect(response.headers.get("Allow")).toBe("POST, OPTIONS");
});

it("refuses a body that is too large before reading it", async () => {
  const services = fakeServices();
  const request = post(validForm());
  request.headers.set("Content-Length", "200000");

  const response = await handleContactRequest(request);

  expect(response.status).toBe(413);
  expect(services.deliver).not.toHaveBeenCalled();
});

it("rejects a body that is not form data", async () => {
  const request = new Request("https://contact.neilarmstrong.dev/", {
    method: "POST",
    headers: {Origin: allowedOrigin, "Content-Type": "application/json"},
    body: "{}",
  });

  const response = await handleContactRequest(request);

  expect(response.status).toBe(400);
  expect(await json(response)).toEqual({ok: false});
});

function fakeServices(overrides: Partial<FakeServices> = {}): FakeServices {
  const services: FakeServices = {
    verifyHuman: vi.fn(async (token: string) => token === "good-token"),
    deliver: vi.fn(async () => undefined),
    ...overrides,
  };
  vi.mocked(verifyTurnstile).mockImplementation(services.verifyHuman);
  vi.mocked(deliverContactMessage).mockImplementation(services.deliver);

  return services;
}

function validForm(): FormData {
  const form = new FormData();
  form.set("name", "Ada Lovelace");
  form.set("email", "ada@example.com");
  form.set("message", "Hello.");
  form.set("website", "");
  form.set("cf-turnstile-response", "good-token");

  return form;
}

function post(form: FormData, origin: string = allowedOrigin): Request {
  return new Request("https://contact.neilarmstrong.dev/", {
    method: "POST",
    headers: {Origin: origin, "CF-Connecting-IP": "203.0.113.9"},
    body: form,
  });
}

function preflight(origin: string): Request {
  return new Request("https://contact.neilarmstrong.dev/", {
    method: "OPTIONS",
    headers: {Origin: origin, "Access-Control-Request-Method": "POST"},
  });
}

async function json(response: Response): Promise<ContactResponse> {
  return (await response.json()) as ContactResponse;
}
