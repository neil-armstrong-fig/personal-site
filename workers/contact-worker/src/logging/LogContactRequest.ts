export const contactRequestOutcomes = [
  "missing_configuration",
  "origin_rejected",
  "preflight",
  "method_rejected",
  "body_too_large",
  "form_unreadable",
  "honeypot_tripped",
  "fields_invalid",
  "turnstile_missing",
  "turnstile_rejected",
  "turnstile_unavailable",
  "delivered",
  "delivery_failed",
] as const;

export type ContactRequestOutcome = (typeof contactRequestOutcomes)[number];

interface ContactRequestLogEvent {
  event: "contact_request";
  outcome: ContactRequestOutcome;
  method: string;
  status: number;
  errorName?: string;
}

interface LogContactRequestOptions {
  outcome: ContactRequestOutcome;
  method: string;
  status: number;
  errorName?: string;
}

// Keep this event deliberately smaller than Cloudflare's invocation log. It must never receive request metadata,
// contact fields, Turnstile tokens or exception messages.
export function logContactRequest({outcome, method, status, errorName}: LogContactRequestOptions): void {
  const contactRequestLogEvent: ContactRequestLogEvent = {event: "contact_request", outcome, method, status};

  if (errorName !== undefined) {
    contactRequestLogEvent.errorName = errorName;
  }

  if (outcome === "missing_configuration" || outcome === "delivery_failed") {
    console.error(contactRequestLogEvent);
    return;
  }

  if (outcome === "turnstile_unavailable") {
    console.warn(contactRequestLogEvent);
    return;
  }

  console.info(contactRequestLogEvent);
}
