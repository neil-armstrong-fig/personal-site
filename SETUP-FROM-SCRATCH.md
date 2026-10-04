# Setting this site up from scratch

Everything that lives outside the code: what was created by hand on Cloudflare and GitHub, what is local-only and not in
git, and what the workflows automate. Use it to rebuild the site on a fresh account, and to check nothing has been
forgotten. Last verified against the live accounts on 2026-10-01.

Keep it current: any change to infrastructure, secrets, DNS, workflow triggers or deployment steps updates this file in
the same pass (see `AGENTS.md`). Never put an account ID, zone ID, token, secret or personal address in it; use the
placeholders below.

Placeholders: `<account-id>` is the Cloudflare account ID (in the dashboard URL), `<zone-id>` is the `neilarmstrong.dev`
zone ID, and `<inbox>` is the address contact messages are delivered to.

## What exists

### Cloudflare (created by hand; none of it is in code)

| Item                           | Details                                                                                                                                                                                                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Zone `neilarmstrong.dev`       | Nameservers `lex.ns.cloudflare.com` and `pola.ns.cloudflare.com`. All DNS lives here.                                                                                                                                                                                                                                          |
| DNS: apex                      | Four A records to GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. **DNS-only (not proxied)**, so GitHub serves the apex directly.                                                                                                                                                    |
| DNS: `www`, `janggi`           | CNAME to `neil-armstrong-fig.github.io`. `janggi` belongs to the separate Janggi repository and its own Pages deployment.                                                                                                                                                                                                      |
| DNS: `media`, `contact`        | Proxied records created automatically by the R2 custom domain and the Worker custom domain. Do not create them by hand.                                                                                                                                                                                                        |
| DNS: mail                      | MX `route1`, `route2` and `route3.mx.cloudflare.net` and the SPF TXT `v=spf1 include:_spf.mx.cloudflare.net ~all`, added by enabling Email Routing. Enabling it affects any other mail on the domain.                                                                                                                          |
| DNS: Google Search Console     | TXT record generated when the Search Console domain property was verified. Keep the value in Cloudflare, not in this file.                                                                                                                                                                                                     |
| R2 bucket                      | `personal-site-videos`. Custom domain `media.neilarmstrong.dev` (active). The public `r2.dev` URL is **disabled**. CORS: GET and HEAD from `https://neilarmstrong.dev` and `http://localhost:4321` (the Astro dev server). Minimum TLS 1.2. Lifecycle: the default rule that aborts incomplete multipart uploads after 7 days. |
| R2 S3 credentials              | An R2 API token (Object Read & Write on the bucket), used by rclone only. Stored in the local `~/.config/rclone/rclone.conf` as the remote `cloudflare-personal-site-videos`, whose `endpoint` is `https://<account-id>.r2.cloudflarestorage.com` (no bucket path).                                                            |
| Worker `personal-site-contact` | Created by the first `wrangler deploy` from `workers/contact-worker/`. Custom domain `contact.neilarmstrong.dev`; `workers.dev` and preview URLs are off (`wrangler.jsonc`). Observability is off.                                                                                                                             |
| Worker secrets                 | `TURNSTILE_SECRET` and `CONTACT_TO_ADDRESS` (`<inbox>`), set once with `wrangler secret put`. A deploy leaves them in place. They are never in git or `wrangler.jsonc`.                                                                                                                                                        |
| Turnstile widget               | For hostname `neilarmstrong.dev`. The **site key** is public and lives in `webapp/src/site/SiteConfig.ts`; the **secret** is the Worker secret above.                                                                                                                                                                          |
| Email Routing                  | Enabled on the zone, with `<inbox>` added and verified as a destination address. The Worker sends from `contact@neilarmstrong.dev` through the `send_email` binding.                                                                                                                                                           |
| API token for CI               | A token from the "Edit Cloudflare Workers" template, scoped to the account and the zone (Workers Scripts edit, Workers Routes edit, and DNS edit for the custom domain). Stored only as a GitHub secret.                                                                                                                       |
| WAF rate-limit rule            | None. Checked 2026-10-01: no rules exist, and adding one is a paid add-on. Abuse protection is the Worker's origin, honeypot, field-limit and Turnstile checks.                                                                                                                                                                |

### GitHub (created by hand)

- **Pages** on this repository: source is GitHub Actions, custom domain `neilarmstrong.dev`, HTTPS enforced. `main` has
  no branch protection.
- **Pages** on the Janggi repository: custom domain `janggi.neilarmstrong.dev`, HTTPS enforced.
- **Repository secrets used by workflows:** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (the Worker deploy).
- **No other repository secrets.** The Strava credentials live only in the local `.env` (the sync runs locally), and
  `CONTACT_TO_ADDRESS` and `TURNSTILE_SECRET` live only on the Worker. Copies of all five were deleted from GitHub on
  2026-10-01 because no workflow read them. The Turnstile secret can be read again in the Turnstile dashboard.

### Google Search Console (created by hand)

- The `neilarmstrong.dev` domain property is verified through the Cloudflare DNS record above.
- `https://neilarmstrong.dev/sitemap-index.xml` is submitted. Search generative AI inclusion is an account setting.
  Keep it set to **Include my site's links and content in Search generative AI features**.

### Local only (not in git)

- **`.env`** in the repository root: the Strava credentials. The refresh token rotates, and the sync script rewrites it.
- **`private-source/`**: the CV, original photographs and videos, drafts and Strava caches. **The processed MP4s exist
  only in R2; `private-source/` holds the originals they are regenerated from, so keep it backed up.**
- **A Strava API application** (strava.com/settings/api) with the `activity:read` scope.
- **The rclone remote** described above.
- **A Wrangler login** (`wrangler login`) for deploying the Worker by hand. CI uses the token instead.
- **The IndexNow key** is the one deliberate exception: `webapp/public/indexnow-key.txt` is committed because the key is
  meant to be public.

## What is automated

| Trigger                                                                                                               | Workflow                    | Does                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Push to `main`, or a pull request                                                                                     | `ci-cd.yml`                 | `pnpm build` (all package checks, the Astro build, and `validate:build`, which HEAD-checks every trip video on the R2 origin). On `main` only, then deploys to Pages and notifies IndexNow. |
| Push to `main`                                                                                                        | `lighthouse.yml`            | Lighthouse CI against `webapp/dist/`.                                                                                                                                                       |
| Push to `main` that changes `workers/contact-worker/src/**`, its `wrangler.jsonc` or `shared/src/**`, or a manual run | `deploy-contact-worker.yml` | The `shared` and Worker checks, then `wrangler deploy`, which also applies the custom-domain route from `wrangler.jsonc`. Secrets are untouched.                                            |

**Not automated, always by hand:** uploading videos to R2 (`rclone copy`, dry run first), the bucket's domain and CORS,
every secret, Turnstile, Email Routing, DNS beyond the automatic records, Search Console, the Strava sync and media
scripts, and photo and video processing. Pushing the site does not publish the Worker unless its source changed.

## Rebuilding from nothing

1. **Domain.** Add `neilarmstrong.dev` to Cloudflare and point the registrar at the two nameservers above.
2. **GitHub.** Create the repository, push the code, and in Settings → Pages choose GitHub Actions as the source, set the
   custom domain and enforce HTTPS. Add the four apex A records and the `www` CNAME. Do the same for the Janggi
   repository if it is being rebuilt.
3. **Google Search Console.** Create the `neilarmstrong.dev` domain property, add its generated verification record to
   Cloudflare DNS, submit `https://neilarmstrong.dev/sitemap-index.xml`, and keep Search generative AI inclusion set to
   **Include my site's links and content in Search generative AI features**. Never copy the verification value here.
4. **R2.** Create the bucket `personal-site-videos`, attach the custom domain `media.neilarmstrong.dev`, add the CORS
   rules from the table, and leave the `r2.dev` URL disabled. Create an R2 API token and the rclone remote. Check each
   setting afterwards with `wrangler r2 bucket domain list`, `cors list`, `dev-url get` and `lifecycle list`.
5. **Local files.** Restore `private-source/` and `.env`. Re-create the videos with `pnpm trip:videos <trip-slug>`, then
   upload them with the `rclone copy ... --dry-run` and real copy steps in `webapp/src/content/trip/AGENTS.md`. **The production build fails until
   every clip exists in R2.**
6. **Email and Turnstile.** Enable Email Routing and verify `<inbox>` as a destination. Create the Turnstile widget for
   `neilarmstrong.dev` and put its site key in `webapp/src/site/SiteConfig.ts`.
7. **Worker.** Run `wrangler login`, then `pnpm run deploy` from `workers/contact-worker/`. Set `TURNSTILE_SECRET` and
   `CONTACT_TO_ADDRESS` with `wrangler secret put`, and confirm `contact.neilarmstrong.dev` shows as a Custom Domain on
   the Worker.
8. **CI.** Create the Cloudflare API token, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets,
   and push to `main`.
9. **Abuse protection.** Nothing to set up: there is no rate-limit rule (see the table). Add one only if abuse appears.
10. **Check.** Open the live contact page, send a message, and confirm it arrives with the visitor as `Reply-To`.
    Check `https://neilarmstrong.dev/`, `https://janggi.neilarmstrong.dev/` and a trip video URL on the media origin.

## Privacy notes

- Cloudflare's Email Routing activity log keeps message metadata (sender, recipient, subject type, delivery status) for
  about 31 days. Message bodies are not recorded unless the opt-in "Email preview" setting is enabled, and it is not.
  Mail sent from the Worker through `send_email` does appear there (confirmed 2026-10-01): the entry shows only
  `contact@neilarmstrong.dev`, `<inbox>`, the time, a generic subject type and the delivery result, with no visitor
  details or message text.

## Known loose ends

None.
