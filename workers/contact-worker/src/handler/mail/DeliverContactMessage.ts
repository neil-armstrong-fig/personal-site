import {EmailMessage} from "cloudflare:email";

import type {ContactMessage} from "@personal-site/shared/contact/types/ContactMessage";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

import {buildRawEmail} from "./BuildRawEmail";

// Glue to Cloudflare's `send_email` binding. It imports `cloudflare:email`, which only exists inside the Workers
// runtime, so it is one of the files here that unit tests cannot load; keep it to wiring.
export async function deliverContactMessage(contactMessage: ContactMessage): Promise<void> {
  const {CONTACT_FROM_ADDRESS, CONTACT_TO_ADDRESS, CONTACT_MAIL} = workerEnvironment;
  const raw = buildRawEmail({
    contactMessage,
    fromAddress: CONTACT_FROM_ADDRESS,
    toAddress: CONTACT_TO_ADDRESS,
    messageId: crypto.randomUUID(),
    date: new Date(),
  });

  await CONTACT_MAIL.send(new EmailMessage(CONTACT_FROM_ADDRESS, CONTACT_TO_ADDRESS, raw));
}
