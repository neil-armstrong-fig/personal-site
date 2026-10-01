import {env} from "cloudflare:workers";

// The Worker's bindings, variables and secrets; see wrangler.jsonc for where each one comes from.
interface ContactWorkerEnv {
  ALLOWED_ORIGIN: string;
  CONTACT_FROM_ADDRESS: string;
  CONTACT_MAIL: SendEmail;
  // Secrets: set with `wrangler secret put`, or in .dev.vars locally. Never committed.
  CONTACT_TO_ADDRESS: string;
  TURNSTILE_SECRET: string;
}

// The Worker's bindings, variables and secrets, read from the runtime's global `env` rather than passed down from
// `fetch`, because they are the same for every request. `cloudflare:workers` only exists inside the Workers runtime, so
// unit tests cannot load this file and mock it instead (`vi.mock("@src/env/WorkerEnvironment", ...)`).
// `env` is typed as an empty interface until augmented, hence the cast.
export const workerEnvironment = env as ContactWorkerEnv;
