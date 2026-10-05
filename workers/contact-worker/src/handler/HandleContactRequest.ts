import {contactTransportFields} from "@personal-site/shared/contact/ContactTransportFields";
import type {ContactResponse} from "@personal-site/shared/contact/types/ContactResponse";
import {validateContactMessage} from "@personal-site/shared/contact/ValidateContactMessage";

import {workerEnvironment} from "@src/env/WorkerEnvironment";
import {logContactRequest} from "@src/logging/LogContactRequest";
import type {ContactRequestOutcome} from "@src/logging/LogContactRequest";

import {corsHeaders} from "./cors/CorsHeaders";
import {deliverContactMessage} from "./mail/DeliverContactMessage";
import {verifyTurnstile} from "./turnstile/VerifyTurnstile";

// A form is at most ~20 KB of text; anything declaring more than this is refused without being read.
const maxBodyBytes = 50_000;

export async function handleContactRequest(request: Request): Promise<Response> {
  const allowedOrigin = workerEnvironment.ALLOWED_ORIGIN;
  const origin = request.headers.get("Origin") ?? undefined;
  const headers = corsHeaders(origin, allowedOrigin);

  if (origin !== undefined && origin !== allowedOrigin) {
    return respond(request, {
      contactResponse: {ok: false},
      status: 403,
      corsResponseHeaders: headers,
      outcome: "origin_rejected",
    });
  }

  if (request.method === "OPTIONS") {
    return preflight(request, headers);
  }

  if (request.method !== "POST") {
    headers.set("Allow", "POST, OPTIONS");

    return respond(request, {
      contactResponse: {ok: false},
      status: 405,
      corsResponseHeaders: headers,
      outcome: "method_rejected",
    });
  }

  if (Number(request.headers.get("Content-Length") ?? 0) > maxBodyBytes) {
    return respond(request, {
      contactResponse: {ok: false},
      status: 413,
      corsResponseHeaders: headers,
      outcome: "body_too_large",
    });
  }

  const formData = await readForm(request);

  if (formData === undefined) {
    return respond(request, {
      contactResponse: {ok: false},
      status: 400,
      corsResponseHeaders: headers,
      outcome: "form_unreadable",
    });
  }

  if (fieldText(formData, contactTransportFields.honeypot) !== "") {
    // Look successful so a bot learns nothing, but send nothing.
    return respond(request, {
      contactResponse: {ok: true},
      status: 200,
      corsResponseHeaders: headers,
      outcome: "honeypot_tripped",
    });
  }

  const contactMessageValidation = validateContactMessage({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!contactMessageValidation.valid) {
    return respond(request, {
      contactResponse: {ok: false, invalidFields: contactMessageValidation.invalidFields},
      status: 400,
      corsResponseHeaders: headers,
      outcome: "fields_invalid",
    });
  }

  const token = fieldText(formData, contactTransportFields.turnstileToken);

  if (token === "") {
    return respond(request, {
      contactResponse: {ok: false},
      status: 400,
      corsResponseHeaders: headers,
      outcome: "turnstile_missing",
    });
  }

  const turnstileVerificationResult = await verifyTurnstile(
    token,
    request.headers.get("CF-Connecting-IP") ?? undefined,
  );

  if (turnstileVerificationResult === "unavailable") {
    return respond(request, {
      contactResponse: {ok: false},
      status: 400,
      corsResponseHeaders: headers,
      outcome: "turnstile_unavailable",
    });
  }

  if (turnstileVerificationResult === "rejected") {
    return respond(request, {
      contactResponse: {ok: false},
      status: 400,
      corsResponseHeaders: headers,
      outcome: "turnstile_rejected",
    });
  }

  try {
    await deliverContactMessage(contactMessageValidation.message);
  } catch (error) {
    return respond(request, {
      contactResponse: {ok: false},
      status: 502,
      corsResponseHeaders: headers,
      outcome: "delivery_failed",
      // Keep only the error class. The exception text can quote the recipient address.
      errorName: errorName(error),
    });
  }

  return respond(request, {
    contactResponse: {ok: true},
    status: 200,
    corsResponseHeaders: headers,
    outcome: "delivered",
  });
}

interface RespondOptions {
  contactResponse: ContactResponse;
  status: number;
  corsResponseHeaders: Headers;
  outcome: ContactRequestOutcome;
  errorName?: string;
}

function errorName(error: unknown): string {
  if (error instanceof Error) {
    return error.name;
  }

  return "UnknownError";
}

async function readForm(request: Request): Promise<FormData | undefined> {
  try {
    return await request.formData();
  } catch {
    return undefined;
  }
}

function fieldText(formData: FormData, name: string): string {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function preflight(request: Request, headers: Headers): Response {
  headers.set("Access-Control-Allow-Methods", "POST");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");
  logContactRequest({outcome: "preflight", method: request.method, status: 204});

  return new Response(null, {status: 204, headers});
}

function respond(
  request: Request,
  {contactResponse, status, corsResponseHeaders, outcome, errorName}: RespondOptions,
): Response {
  const headers = new Headers(corsResponseHeaders);
  headers.set("Cache-Control", "no-store");
  logContactRequest({outcome, method: request.method, status, errorName});

  return Response.json(contactResponse, {status, headers});
}
