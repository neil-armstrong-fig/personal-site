import {workerEnvironment} from "@src/env/WorkerEnvironment";
import {handleContactRequest} from "@src/handler/HandleContactRequest";
import {logContactRequest} from "@src/logging/LogContactRequest";

// Cloudflare requires the Worker module to be the default export.
export default {
  async fetch(request: Request): Promise<Response> {
    if (!workerEnvironment.TURNSTILE_SECRET || !workerEnvironment.CONTACT_TO_ADDRESS) {
      logContactRequest({outcome: "missing_configuration", method: request.method, status: 500});

      return Response.json({ok: false}, {status: 500});
    }

    return handleContactRequest(request);
  },
} satisfies ExportedHandler;
