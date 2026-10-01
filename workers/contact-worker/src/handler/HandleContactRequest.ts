import {contactTransportFields} from "@personal-site/shared/contact/ContactTransportFields";
import type {ContactResponse} from "@personal-site/shared/contact/types/ContactResponse";
import {validateContactMessage} from "@personal-site/shared/contact/ValidateContactMessage";

import {workerEnvironment} from "@src/env/WorkerEnvironment";

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
    return respond({ok: false}, 403, headers);
  }

  if (request.method === "OPTIONS") {
    return preflight(headers);
  }

  if (request.method !== "POST") {
    headers.set("Allow", "POST, OPTIONS");

    return respond({ok: false}, 405, headers);
  }

  if (Number(request.headers.get("Content-Length") ?? 0) > maxBodyBytes) {
    return respond({ok: false}, 413, headers);
  }

  const formData = await readForm(request);

  if (formData === undefined) {
    return respond({ok: false}, 400, headers);
  }

  if (fieldText(formData, contactTransportFields.honeypot) !== "") {
    // Look successful so a bot learns nothing, but send nothing.
    return respond({ok: true}, 200, headers);
  }

  const contactMessageValidation = validateContactMessage({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!contactMessageValidation.valid) {
    return respond({ok: false, invalidFields: contactMessageValidation.invalidFields}, 400, headers);
  }

  const token = fieldText(formData, contactTransportFields.turnstileToken);
  const human = token !== "" && (await verifyTurnstile(token, request.headers.get("CF-Connecting-IP") ?? undefined));

  if (!human) {
    return respond({ok: false}, 400, headers);
  }

  try {
    await deliverContactMessage(contactMessageValidation.message);
  } catch (error) {
    console.error("Contact message delivery failed", error);

    return respond({ok: false}, 502, headers);
  }

  return respond({ok: true}, 200, headers);
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

function preflight(headers: Headers): Response {
  headers.set("Access-Control-Allow-Methods", "POST");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");

  return new Response(null, {status: 204, headers});
}

function respond(contactResponse: ContactResponse, status: number, corsResponseHeaders: Headers): Response {
  const headers = new Headers(corsResponseHeaders);
  headers.set("Cache-Control", "no-store");

  return Response.json(contactResponse, {status, headers});
}
