# neilarmstrong.dev

Source for [neilarmstrong.dev](https://neilarmstrong.dev), the personal website of Neil Armstrong, a software
architect and developer in Belfast. It contains software case studies, open-source projects, and long-distance
cycling stories.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

It is a pnpm workspace:

| Folder                    | Contains                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `webapp/`                 | The Astro site, deployed to GitHub Pages                                                  |
| `workers/contact-worker/` | The Cloudflare Worker behind the contact form, deployed by its own workflow with Wrangler |
| `shared/`                 | Base tool configuration, and the code the site and the Worker both use                    |

The contact form posts to the Worker, which checks the message and a Cloudflare Turnstile token and then emails it
through Cloudflare Email Routing. The recipient address and the Turnstile secret are Worker secrets and are not in this
repository. See [AGENTS.md](AGENTS.md) for the structure and the import rules between the packages, and
[SETUP-FROM-SCRATCH.md](SETUP-FROM-SCRATCH.md) for the Cloudflare and GitHub setup done outside the code.

Trip videos are not in this repository. They are uploaded to a Cloudflare R2 bucket (S3-compatible storage) and
served from `media.neilarmstrong.dev`. `pnpm dev` plays clips from a local, gitignored `webapp/public/trips/` folder, while
`pnpm build` checks that every clip exists on the media origin.

Code is [MIT](LICENSE). The writing and photography are not covered by that licence; see
[CONTENT-LICENSE.md](CONTENT-LICENSE.md).
