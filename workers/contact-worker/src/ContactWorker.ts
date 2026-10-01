import {workerEnvironment} from "@src/env/WorkerEnvironment";
import {handleContactRequest} from "@src/handler/HandleContactRequest";

// Cloudflare requires the Worker module to be the default export.
export default {
  async fetch(request: Request): Promise<Response> {
    if (!workerEnvironment.TURNSTILE_SECRET || !workerEnvironment.CONTACT_TO_ADDRESS) {
      console.error("Contact Worker is missing a secret: set TURNSTILE_SECRET and CONTACT_TO_ADDRESS.");

      return Response.json({ok: false}, {status: 500});
    }

    return handleContactRequest(request);
  },
} satisfies ExportedHandler;
