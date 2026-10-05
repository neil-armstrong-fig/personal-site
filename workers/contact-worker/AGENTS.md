# AGENTS.md — contact-worker

The only server-side code: a Cloudflare Worker behind the contact form. It receives the POST at
`https://contact.neilarmstrong.dev/` (a Workers custom domain, because the apex is DNS-only on GitHub Pages), checks the
origin, the honeypot and the field limits, verifies the Turnstile token, and sends the message through Email Routing's
`send_email` binding with the visitor as `Reply-To`. The field names, limits and response JSON come from
`@personal-site/shared/contact`.

- **Secrets are Worker secrets, never in git, the page or `wrangler.jsonc`:** `CONTACT_TO_ADDRESS` and
  `TURNSTILE_SECRET`, set once with `wrangler secret put`.
- Workers Logs retains one structured outcome for every request. Cloudflare invocation logs and traces stay disabled to
  avoid persisting their full request metadata. Worker code logs only the outcome, method, status and an optional error
  class. Never add URLs, headers, IPs, locations, origins, form fields or values, addresses, messages, Turnstile tokens,
  secrets or exception messages.
- Bindings and secrets come from the shared `workerEnvironment` (`src/env/WorkerEnvironment.ts`, the runtime's global
  `env`), not threaded through `fetch`.
- `WorkerEnvironment.ts`, `ContactWorker.ts` and `DeliverContactMessage.ts` import `cloudflare:*` modules and so are
  untested: keep them to wiring. A tested file that reads `workerEnvironment` mocks it with
  `vi.mock("@src/env/WorkerEnvironment", ...)`; pure helpers (`corsHeaders`, `buildRawEmail`) take their values as
  arguments.
- `pnpm --filter @personal-site/contact-worker run dev` runs `wrangler dev` against secrets in the ignored `.dev.vars`.
  `pnpm run deploy` publishes by hand and is outward-facing, so ask first; CI normally deploys.
- `workerd`'s install script is denied like `esbuild`'s: the platform package supplies the binary.
- This package may import itself and `@personal-site/shared`, never the site or another Worker.
