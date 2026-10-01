# Personal Website — Agent Instructions

The personal website of the site owner (“the developer”), at `https://neilarmstrong.dev`, from
`https://github.com/neil-armstrong-fig/personal-site`. A pnpm workspace of three packages. Keep these instructions
current as commands, structure and conventions change.

| Package                   | Contains                                               | May import                           | Guidance                                |
| ------------------------- | ------------------------------------------------------ | ------------------------------------ | --------------------------------------- |
| `webapp/`                 | The Astro site (static, GitHub Pages)                  | itself and `@personal-site/shared`   | `webapp/AGENTS.md`, plus `src/content/` |
| `workers/contact-worker/` | The Cloudflare Worker behind the contact form          | itself and `@personal-site/shared`   | `workers/contact-worker/AGENTS.md`      |
| `shared/`                 | Base tool config, and what more than one package needs | itself only: the bottom of the graph | `shared/AGENTS.md`                      |

Read the `AGENTS.md` of every package and folder on the path to what you are changing, in full, before planning. This
file holds only what applies everywhere.

## Read first

- Read `SETUP-FROM-SCRATCH.md` before changing anything that lives outside the code: Cloudflare (DNS, R2, the Worker,
  Turnstile, Email Routing, tokens), GitHub settings and secrets, workflow triggers, or local-only files. It catalogues
  what was created by hand, what is automated, and the order to rebuild it. **Update it in the same pass as any such
  change** (a new resource, secret, DNS record, bucket setting, workflow or deployment step), and never put an account ID,
  zone ID, token, secret or personal address in it.
- Do not reinterpret the site as an online CV, recruiting landing page, cycling-only site, or astronaut-themed novelty.
  Software is the primary content; cycling is a substantial secondary section.
- The public positioning is “Software architect and developer in Belfast.” The voice is first person, concise,
  technically credible, and written in UK English.

## Before changing code

1. Read this file and the relevant parts of the code.
2. Inspect the nearest existing implementation and test that establish the local naming and structure. If none
   exists, say so.
3. Before editing, state which instructions and reference implementations informed the change.
4. Immediately before editing a file, re-read the relevant section so concurrent work is not overwritten.
5. Before handoff, re-read these instructions and perform a standards-only review of the diff. Fix
   deviations that automated tools cannot detect.
6. Report the outcome of every quality-gate run (`pnpm checks`, `pnpm build`, `pnpm lighthouse`) in the handoff
   message, including a run that could not complete and why; never leave a failed or skipped gate unmentioned.
   Anything that needs the developer's decision is flagged there too, and review approvals are theirs to give.

Do not run repo-wide write-format or lint-fix commands when targeted formatting will do. Never use Git
stash, reset, restore, checkout, clean, or another command that could move work belonging to someone else.

Several agent sessions may share this working tree, and nothing announces a new one. Reading is always safe
(`git status`, `git diff`, `pnpm lint`, `pnpm test`), but `git status` shows everyone's work: do not report it
as a description of yours. Prefer a targeted edit to rewriting a whole file, which silently reverts whatever
landed in between. `pgrep -a claude` shows other live sessions; if there are several, ask before any
repo-wide command.

The developer uses the index as an in-progress review snapshot. Treat staged and unstaged files as equally active
working material: continue editing either when the task requires it, but do not run `git add`, alter the
index, or create commits unless the developer explicitly asks.

## Commands

Run every command from the repository root; the root package forwards each to the right package, and `pnpm checks` and
`pnpm build` cover all three. Site-only commands (Strava, trip media, Lighthouse, validation) are in `webapp/AGENTS.md`.

- `pnpm dev` — local development; `pnpm preview` — preview the production build
- `pnpm checks` — lint, format check, type/content check and unit tests: the main quality gate, run with
  `--max-warnings=0`; one package: `pnpm --filter @personal-site/contact-worker run checks`
- `pnpm build` — quality gate, production build, and built-output validation
- `pnpm lint`, `pnpm format:check`, `pnpm type-check`, `pnpm test` — the non-mutating parts of the gate
- `pnpm lint:fix -- <paths...>` and `pnpm format -- <paths...>` — apply fixes only to the explicitly scoped files. Paths
  are repository-root-relative (`webapp/src/pages/...`, `AGENTS.md`), because Prettier and ESLint find each file's own
  package config. Never run them repo-wide.

## Dependencies and tooling

Adopt the code-quality standards from the [Janggi repository](https://github.com/neil-armstrong-fig/janggi) and the dependency-management standards from the [Event-Driven Ledger repository](https://github.com/neil-armstrong-fig/event-driven-ledger-example), without copying their acceptance-test systems or package graphs.

- `pnpm-workspace.yaml` lists `webapp`, `workers/*` and `shared`; the root package only delegates.
- Every direct dependency lives in the default catalog at an exact version; `package.json` uses
  `catalog:` references.
- Every catalog entry has a one-line comment stating its role and the reason for a non-latest pin.
- Use `catalogMode: strict`, `minimumReleaseAge: 1440`, `minimumReleaseAgeStrict: true`,
  `minimumReleaseAgeIgnoreMissingTime: false`, `blockExoticSubdeps: true`, and `trustLockfile: false`.
- Review dependency install scripts and record explicit, commented `allowBuilds` decisions. Never
  enable all build scripts as a shortcut.
- `esbuild` and `sharp` install scripts are denied: their optional platform packages provide the
  binaries, verified through the production build and a direct Sharp image operation.
- Pin `pnpm@12.3.4` in `packageManager` and commit `pnpm-lock.yaml`.
- CI installs with `pnpm install --frozen-lockfile`.
- ESLint flat config covers JavaScript, TypeScript, and Astro and runs with `--max-warnings=0`.
- Ask before adding or upgrading a dependency. After approval, use `pnpm add --save-catalog`, replace
  any generated range with an exact pin, normalise the catalog key to double quotes, add its rationale
  comment, and run `pnpm install --lockfile-only`.
- Never delete or rebuild `pnpm-lock.yaml`. Update it in place and review the manifest, catalog, and
  lockfile diff together.

## Code style

Prettier owns formatting (120 columns, two spaces, semicolons, double quotes, trailing commas) and the shared ESLint and
strict TypeScript config in `shared/config/` owns the rest. **Change a rule there, not in a package.** What they will
not tell you:

- Extend strict TypeScript; use `import type` for type-only imports and explicit return types for named functions and
  module boundaries. TypeScript 6 resolves `paths` relative to the config file, so configure `@src/*` without `baseUrl`.
  TypeScript 7 is deferred until Astro Check and typescript-eslint support it.
- Source code never imports through `../`; use each package's `@src/*` alias (same-folder `./` is fine). Within
  `shared`, reach another folder by the package name.
- Import boundaries are enforced by ESLint. **Never write `"no-restricted-imports"` directly in an override**: flat config
  replaces the rule rather than merging it, so the layering vanishes for those files. Call `restrictedImports(...)` from
  `shared/config/eslint.base.js`.
- Use strict equality and no unused values. A control-flow body printed across multiple lines is braced.
- Prefer named exports; a default export only where a framework or tool requires one.
- **Locality over layers.** A file lives as close to its caller as it can, in a subdirectory of it; a helper used by one
  file goes in a folder beneath it, never beside it. Something shared by two siblings rises to their nearest common
  ancestor and no further. Name a folder for its subject (`measurements/`), not its shape; `utils/` is the last resort,
  and there is no top-level `utils/`, `helpers/`, `common/` or `misc/`. `webapp/AGENTS.md` has the full folder set.
- Components and TypeScript files are PascalCase and name their single primary export, one per file; a test sits beside
  its subject as `Subject.test.ts`.
- Add a nested `AGENTS.md` to a folder only once folder-specific guidance has accumulated there.
- Declare helper functions below their callers with function declarations so a module reads top to
  bottom. Helpers must be `function` declarations: an arrow `const` is in the temporal dead zone above its
  line. A framework-typed export such as `GET: APIRoute` or `getStaticPaths` is the exception.
- Extract non-trivial pure logic when it can be tested independently; keep a small closure local only
  when extraction would make its caller harder to read.
- Give every object and union type a name, even when it is used only once. Do not put anonymous object
  shapes in generic constraints, properties, assertions, parameters, return types or a `Record` value.
  A component's local `Props` interface is the naming convention for its props; call it `Props` and do
  not export it. If a library or framework API makes naming a type genuinely impossible, leave a comment
  explaining why.
- Derive runtime-backed literal unions from an `as const` list.
- Name a variable after the type it holds where the type has a name of its own.
- Use at most three positional parameters; beyond that, pass a named options object. A context or
  dependency the function acts through may remain positional before that options object.
- Avoid ternary expressions. In templates, use separate `cond && (...)` and `!cond && (...)` blocks; otherwise use an
  explicit `if` or a clearly named helper.

## Unit testing

- Use Vitest in its Node environment for non-trivial pure logic.
- Priorities include conversion, filtering/sorting, URL creation, image/SEO metadata and structured-data builders.
- Keep a simple function's tests as top-level `it(...)` cases. Use `describe` only when it conveys real
  shared context or removes meaningful repetition.
- After mutating code for a test, `grep` the file to confirm the mutation survived (Prettier can silently reflow
  a multi-line one, giving a false green), and note which tests fell: the wrong ones, or too many, mean the
  cover is in the wrong place.
- A passing test is evidence only after it has been observed failing for the expected reason. Write new
  tests before the implementation where practical. For tests added after code or inherited coverage,
  mutate the claimed behaviour, verify the mutation is present, and note which test fails before restoring
  the implementation.

## Privacy

`private-source/` is the developer's local, git-ignored working material (CV, original photographs, drafts,
Strava caches). It is not part of the public repository: never commit, publish, move or delete it. Scripts read from it.

Local working copy may temporarily contain personal or unapproved review text. Before any public push,
perform a complete privacy audit of the exact tree and history intended for publication. This does not
relax the exclusions for the private CV, raw photographs, GPS metadata, phone number, or private email.

## Git and deployment

- Do not create Git commits or alter the index unless the developer explicitly asks; they stage and commit
  themselves, and staged files remain editable.
- Target public repository: `neil-armstrong-fig/personal-site` (`origin`).
- Production hosting: GitHub Pages through `.github/workflows/deploy.yml`, with `webapp/public/CNAME` for the custom domain.
  `.github/workflows/lighthouse.yml` audits `webapp/dist/` separately.
- The contact Worker deploys through `.github/workflows/deploy-contact-worker.yml` on a push to `main` that changes
  `workers/contact-worker/src/`, its `wrangler.jsonc` or `shared/src/`, or when run by hand from GitHub, after its
  package checks. It needs the repository secrets
  `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; the Worker's own secrets are set once with `wrangler secret put`.
- Do not change DNS or GitHub Pages settings without an explicit deployment task.
- Preserve `janggi.neilarmstrong.dev`; its CNAME and existing deployment are independent of the root site.

## Licensing

- Source code: MIT.
- Personal writing and photography: copyright retained; not covered by the MIT licence.
- Make this distinction clear in the README and public repository.

## Keeping context small

Every tool result is re-read on each later call, so a large one is paid for repeatedly. Read the part of a file
you need (`grep -n`, then a ranged read), never sweep a directory by printing every file, and do not re-read
this file, which is already loaded. Never skip a check to save context; a passing `pnpm checks` is quiet. Every
session pays for this file in full, so when adding to it, remove whatever the addition supersedes.

## Maintaining this file

Update the nearest `AGENTS.md` when a command, version pin, convention, content invariant, or recurring failure mode
becomes concrete, and `SETUP-FROM-SCRATCH.md` for any infrastructure or secret that exists outside the code. Remove
what the addition supersedes, and keep each file specific to its folder.
