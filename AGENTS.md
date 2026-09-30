# Personal Website — Agent Instructions

This is the Astro/TypeScript personal website for the site owner (“the developer”), served at `https://neilarmstrong.dev` from `https://github.com/neil-armstrong-fig/personal-site`. Keep these instructions current as commands, structure, and conventions change.

## Read first

- Read `WRITEUP-ADVICE.md` before drafting, reviewing, or restructuring any trip story, case study, or project
  write-up; it holds the readability research behind the trip-chapter threshold below.
- Do not reinterpret the site as an online CV, recruiting landing page, cycling-only site, or astronaut-themed novelty.
- Software is the primary content; cycling is a substantial secondary section.
- The public positioning is “Software architect and developer in Belfast.”
- The voice is first person, concise, technically credible, and written in UK English.

## Expected stack

- Astro 7.3.4
- TypeScript 6.0.3 with strict checking; TypeScript 7 is deferred until Astro Check and typescript-eslint
  support it
- Tailwind CSS 4.3.3
- Leaflet 1.9.4 with `@types/leaflet` 1.9.22 for lazy, read-only cycling maps
- Node.js 24.21.0
- pnpm 12.3.4, a root-only `pnpm-workspace.yaml`, a default dependency catalog, and a committed
  `pnpm-lock.yaml`
- Astro content collections for open-source projects, anonymised professional case studies and cycling trips
- Static GitHub Pages output

Prefer static Astro components and build-time work. Do not add React, Vue, a CMS, a server runtime, a database, or client-side state unless a concrete requirement justifies it and the developer approves the scope change.

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

- `pnpm dev` — start local development, clearing the content cache first so content and schema changes
  are never stale
- `pnpm checks` — lint, format check, type/content check, and unit tests; the main quality gate
- `pnpm lint` — non-mutating lint checks
- `pnpm lint:fix -- <paths...>` — apply ESLint fixes only to the explicitly scoped files
- `pnpm format -- <paths...>` — apply Prettier only to the explicitly scoped files
- `pnpm format:check` — non-mutating formatting check
- `pnpm type-check` — Astro and TypeScript validation
- `pnpm test` — automated tests
- `pnpm build` — quality gate, production build, and built-output validation
- `pnpm validate:build` — validate built links and essential SEO invariants in `dist/`
- `pnpm strava:sync` — pull activities with the credentials in `.env`, keep raw responses in `private-source/`,
  and write a coordinate-free `strava.json` snapshot plus privacy-trimmed `routes.json` into each trip folder
- `pnpm strava:sync-media` — rate-limit and cache Strava activity photo lists and originals under
  `private-source/`, then write one inspected, metadata-free ride-log derivative per activity where available
- `pnpm trip:photos <trip-slug>` — turn the originals listed in `private-source/trips/<slug>/photos.json` into
  metadata-free 1,600 px JPEGs in the trip's `_assets/`, failing on any remaining EXIF/XMP/IPTC/ICC or a source
  under 1,200 px
- `pnpm trip:videos <trip-slug>` — the same for `videos.json`: metadata-free MP4s and posters in `public/trips/<slug>/`
  (uses the bundled `@ffmpeg-installer/ffmpeg`)
- `pnpm lighthouse` — Lighthouse CI against `dist/` (run `pnpm build` first): SEO/accessibility/best practices ≥95,
  performance ≥90, LCP ≤2.5 s, CLS ≤0.1 on the mobile preset. It runs in its own workflow
  (`.github/workflows/lighthouse.yml`); run it locally for changes that could affect performance, not after every edit.
- `pnpm preview` — preview the production build

Do not run formatters in write mode without checking the worktree and the task scope.

## Code style and tooling

Adopt the useful code-quality standards from the [Janggi repository](https://github.com/neil-armstrong-fig/janggi) and dependency-management standards from the
[Event-Driven Ledger repository](https://github.com/neil-armstrong-fig/event-driven-ledger-example) without copying their acceptance-test systems or package graphs.
This project is a root-only pnpm workspace with one deployable package.

- `pnpm-workspace.yaml` omits `packages`, so only the root package is included.
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
- Prettier owns formatting: 120 columns, two spaces, semicolons, double quotes, trailing commas, no
  bracket spacing, avoided arrow parentheses, and LF endings.
- Extend Astro strict TypeScript and enable `verbatimModuleSyntax`, `noUncheckedIndexedAccess`,
  `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`,
  `forceConsistentCasingInFileNames`, and `noEmit`.
- TypeScript 6 resolves `paths` relative to the config file, so configure `@src/*` without adding
  `baseUrl`.
- Use `import type` for type-only imports and explicit return types for named functions and module
  boundaries.
- Use strict equality and no unused values. A control-flow body printed across multiple lines is braced.
- Put one blank line between sibling elements in HTML, Astro templates, and TSX, at every nesting level.
- Configure `@src/*`; source code must not import through `../`. Same-folder `./` imports are fine.
- Never write `"no-restricted-imports"` directly in an ESLint override: flat config replaces the rule rather
  than merging it, so the layering and parent-import restrictions vanish for those files. Call
  `restrictedImports(...)` in `eslint.config.js`.
- Keep source dependencies one-way, enforced by ESLint: `pages` may compose everything; `layouts` may
  depend on shared components, content and site code; shared `components` may depend on content and site
  code; `site` may depend on content; and `content` depends on none of those higher layers. `scripts` (command-line
  tools) may depend on content, site and shared components, and nothing else may depend on `scripts`. A narrower
  override must preserve both the layering rules and the parent-import restriction.
- Prefer named exports. Use a default export only where Astro or a tool configuration requires one.
- Ask before adding or upgrading a dependency. After approval, use `pnpm add --save-catalog`, replace
  any generated range with an exact pin, normalise the catalog key to double quotes, add its rationale
  comment, and run `pnpm install --lockfile-only`.
- Never delete or rebuild `pnpm-lock.yaml`. Update it in place and review the manifest, catalog, and
  lockfile diff together.

## File and folder structure

This follows the locality model in the [Janggi repository](https://github.com/neil-armstrong-fig/janggi) (its root `AGENTS.md` and `webapp/src/react/AGENTS.md`),
adapted to Astro. Locality over layers: a file's depth tells you its blast radius before you open it.

### Roots

- Conventional Astro roots are `src/assets`, `src/components`, `src/content`, `src/layouts`, `src/pages`,
  `src/scripts`, `src/site`, and `src/styles`.
- `src/components` holds only pure, generic components shared across the site, such as `Button`, `Container`,
  `Section` and `Prose`. Anything used by a single page lives in a `_components/` folder beside that page.
  Something shared by several pages rises to their nearest common parent folder (`src/pages/software/_components/`
  for two software routes); it reaches `src/components` only when it is generic enough to belong to no page at
  all. Being site-wide in spirit (a header, a portrait, a route flourish) is not enough. `src/layouts` holds layouts shared by several routes.
- A single-caller component still lives beside its caller, however site-wide it looks: the header, footer and
  skip link sit under `src/layouts/components/` because only `BaseLayout` renders them, and the home-only
  `Portrait`, `GridBackdrop` and `RouteLine` sit in `src/pages/_components/`. Shared code rises only when a
  second caller appears.
- Helpers follow the same rule: a builder called by one route sits beside that route, one shared by several
  routes sits in their common parent's `_components/`, and `src/site` keeps only what layouts, pages and
  content all genuinely share (`SiteConfig`, identifiers, URL builders).
- Command-line scripts are TypeScript under `src/scripts/<script-name>/`, one folder per script (`sync-strava/`,
  `process-trip-photos/`), each with its `<ScriptName>.ts` entry point and the helpers and tests only it uses in
  subject folders beneath it. Code two scripts share lives in `src/scripts/shared/<subject>/`; code that pages also
  read stays in `src/content/`. Node 24 strips the types itself, so there is no ts-node or tsx: run a script with
  `node --import ./src/scripts/register-src-alias/RegisterSrcAlias.ts <script>.ts`, which resolves `@src/*` and
  extensionless imports, and give any new script the same flag. Scripts import source with `@src/*`, never `../`.
  Scripts run from the repository root (every entry point is a `pnpm` script), so build paths from
  `process.cwd()`, never a file-relative `new URL("../", ...)`: a moved file does not rewrite it. Type stripping cannot compile enums, namespaces or
  parameter properties, so do not use them.
- Moving a file rewrites its imports but not path strings. `import.meta.glob` patterns and the keys used to
  look results up must be root-absolute (`/src/content/trip/entries/*/strava.json`), never relative, so a move cannot
  silently empty them; after any move, check the built page content, not only that it compiled.
- Below a root, group by subject: `navigation/`, `identity/`, `seo/`, `software/`, `cycling/`.

### Placement: as close to the caller as possible

- A file lives as close to its caller as it can, in a subdirectory of it. A helper used by one file goes
  in a folder beneath it, never beside it.
- Something shared by two siblings rises to their nearest common ancestor and no further.
- A component used by one route lives in a `_components/` folder beside that route. Astro turns every
  file under `src/pages` into a route unless the path starts with an underscore, so this is the
  `components/` folder of Janggi's layout. Routes here are files, so `_components/` sits at the level of
  the route file or folder that uses it; when several routes share a component, it rises to the nearest
  common folder.
- Route files follow URL conventions (`index.astro`, `[slug].astro`, `404.astro`). Content slugs are
  kebab-case.

### The folder set

The same set of folders recurses at every level, and a folder appears only once something needs it:

```
src/pages/cycling/
  index.astro, [slug].astro        the routes
  _components/
    trip-card/TripCard.astro       one folder per component, named for its subject in kebab-case
    trip-stats/                    shared by TripCard and [slug].astro, so it sits at their common folder
      TripStats.astro
      components/                  components only TripStats renders, each in its own folder
      types/                       exported types reused by other files, one per file
      utils/                       plain functions called only by TripStats
        TripMeasurements.ts
        TripMeasurements.test.ts
```

- **Every component gets its own folder**: `components/<thing>/<Thing>.astro` (`_components/` for routes),
  however small it is or few callers it has. Inline one only where extracting it would be actively
  misleading, and leave a comment saying why.
- **`components/`** holds components rendered only by the enclosing component, each in its own folder.
- **`types/`** holds exported named types that other files reuse, one type per file, named for it. A type
  that is not exported stays in the file that uses it and needs no `types/` folder; create the folder
  only when a type is exported and reused. `types/` sits beside the highest caller that shares the type
  (`src/pages/cycling/_components/neighbours/types/Neighbours.ts`).
- **`utils/`** holds plain functions, with their tests, that only the enclosing component or module calls.
  It is the last resort: if the functions share a subject, prefer a subject-named folder
  (`measurements/`, `neighbours/`) beside the caller. Anything shared rises out of `utils/` to the
  nearest common ancestor's own `utils/` or subject folder.
- **Subject folders** (`<subject>/`) hold plain functions on one subject. Name a folder for its subject,
  not its shape: `neighbours/` and `measurements/` say what is inside; `helpers/`, `common/`, `misc/` and
  `styles/` describe form and leave a reader no wiser. Never create top-level `utils/`, `helpers/`,
  `common/` or `misc/` folders.
- **Content and loaders** stay together under `src/content/`, one folder per content type: `trip/`, `project/`
  and `professional-case-study/`. Each holds its schema factory, published-content getter, tests and helpers,
  with the Markdown in an `entries/<slug>/` subfolder. Trip-only code that pages or the build read (`strava/`
  snapshots, routes and ride media, `trip-figures/`) lives inside `trip/`; code only a script runs lives under
  `src/scripts/`. Anything all three types use, such as `IsPublished` and `SortNewestFirst`, lives in `src/content/shared/`.
- Split or rename a section on one side only if you do the same for anything that mirrors it.

### Files

- Components and TypeScript source files are PascalCase and name their single primary export. One export
  per file; a filename names what it exports.
- A unit test sits beside its subject as `Subject.test.ts`.
- A folder root is its table of contents: the handful of entry points that say what is in there stay at
  the top, and everything else drops into a subject-named subfolder. Roughly six unrelated files is a
  warning sign, not a hard limit.
- Add a nested `AGENTS.md` to a folder only once folder-specific guidance has accumulated there.

### Code shape

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
- Avoid ternary expressions. In Astro templates, express two render branches as separate
  `{condition && (...)}` and `{!condition && (...)}` blocks. For value-producing branches that cannot
  be expressed safely with short-circuiting or nullish coalescing, use an explicit `if` statement or a
  clearly named helper function.
- Use at most three positional parameters; beyond that, pass a named options object. A context or
  dependency the function acts through may remain positional before that options object.

## Unit testing

- Use Vitest in its Node environment for non-trivial pure logic.
- Priorities include measurement conversion, content filtering/sorting, URL creation, image/SEO metadata,
  and structured-data builders.
- Keep a simple function's tests as top-level `it(...)` cases. Use `describe` only when it conveys real
  shared context or removes meaningful repetition.
- After mutating code for a test, `grep` the file to confirm the mutation survived (Prettier can silently reflow
  a multi-line one, giving a false green), and note which tests fell: the wrong ones, or too many, mean the
  cover is in the wrong place.
- A passing test is evidence only after it has been observed failing for the expected reason. Write new
  tests before the implementation where practical. For tests added after code or inherited coverage,
  mutate the claimed behaviour, verify the mutation is present, and note which test fails before restoring
  the implementation.
- Do not add shallow Astro component tests, jsdom by default, or a Playwright acceptance-test suite.
- Validate pages through Astro compilation, the production build, generated-HTML assertions,
  accessibility/Lighthouse auditing, and manual phone/desktop review.

## Privacy and source-material rules

`private-source/` is the developer's local, git-ignored working material (CV, original photographs, drafts,
Strava caches). It is not part of the public repository: never commit, publish, move or delete it. Scripts read from it.

The CV is private reference material only. Never publish, copy into `public/`, or commit it. Do not expose its phone number or personal email address.

The original portrait contains EXIF metadata including GPS data. Never commit or deploy the original.
The current public portrait derivative was made by removing all JPEG application and comment segments;
its compressed image data is byte-for-byte identical to the source scan. Verify every future derivative
contains no EXIF/GPS or other sensitive metadata and inspect its rendered output. Apply the same rule to
all trip photography.

Raw trip notes and photographs, including Strava API responses and downloaded Strava photos, belong in an ignored `private-source/` directory. Only reviewed, sanitised derivatives and approved copy may enter the public source tree.

Local working copy may temporarily contain personal or unapproved review text. Before any public push,
perform a complete privacy audit of the exact tree and history intended for publication. This does not
relax the exclusions for the private CV, raw photographs, GPS metadata, phone number, or private email.

Do not publish current or former employer names or client names in the professional biography, About page, or software case studies in v1; professional work must be anonymised. Cycling trip write-ups may name people and organisations as the developer wrote them in his own Strava descriptions: do not redact them, and the developer reviews them before the public push. Never explain what the `FT` trip prefix stands for anywhere public (slugs, titles, alt text, notes, docs); the public name is "Loop of Europe". Do not invent or infer cycling stories; draw them only from the developer's own Strava activities, descriptions, and notes.

## Content rules

- Use first-person UK English.
- Prefer Oxford commas in prose, captions, and alt text.
- Keep copy concrete and avoid inflated marketing language.
- Verify technical claims against the private CV or public repositories.
- Initial software case studies are Janggi and TQCC.
- Do not copy README files wholesale; rewrite them for a personal case-study audience.
- Store project and trip prose in Markdown content collections.
- Define collection schemas through `src/content.config.ts`; keep the project and trip schema factories
  beside their focused unit tests in each type's folder under `src/content/`.
- Collection text and alt text must be non-blank. Projects require at least one technology; trips require
  at least one location and country, positive optional duration/distance/elevation values, and an end date
  on or after the start date.
- Parse content dates to `Date` and HTTP(S) links to `URL` at the schema boundary. Local content images
  must use Astro's `image()` schema helper.
- Draft content must not generate public routes or appear in lists or sitemaps.
- Each project or trip is a folder named for its slug (`src/content/project/entries/janggi/index.md`) holding its
  Markdown and an `_assets/` subfolder for the images only it uses, referenced relatively
  (`./_assets/hero.png`). Only shared images belong in `src/assets/`.
- Display trip distance and elevation in both metric and imperial units, computed at build time.
- Videos are limited to short self-hosted trip clips (below); no social or third-party embeds, no other videos, generic blog, résumé download, CMS, or contact form in v1. Build-time Strava API
  (`activity:read` only), GPX tooling and read-only Leaflet/OpenStreetMap ride maps are in scope from 2026-09-25;
  keep credentials in the ignored `.env`, never print them, trim 5 km from the first trip start and final trip
  finish, and keep the coordinate-free snapshot separate from the route manifest.
- Ride maps lazy-load their static route manifest, Leaflet and OpenStreetMap tiles only after the native ride-log
  disclosure opens and the map approaches the viewport. Keep visible attribution, a keyboard-native full-screen
  button, scroll-wheel zoom disabled in embedded cards but enabled in full-screen mode, and reduced-motion support;
  preserve all ride names, measurements, photographs and links without JavaScript.
- Trip stories follow the workflow in "Adding a trip story" below. Any long write-up — trip, case study, or
  project — follows the length and structure guidance in `WRITEUP-ADVICE.md`; case studies and projects have no
  chapter-splitting mechanism today, so a draft long enough to need one is a scope question for the developer, not
  something to build unilaterally.
- Every new or substantially rewritten long-form piece (trip, open-source project, professional case study) goes
  through "Editorial review of long-form copy" below. Comparison pages offer only A and B choices, never a “Both”
  or “Show both” option; the developer wants to review each version in isolation.
- The primary contact action is a LinkedIn message framed as “open to conversations,” not “actively looking.”

## Editorial review of long-form copy

One workflow for trips, open-source projects and professional case studies. The trip-specific mechanics are in
"Adding a trip story"; the first professional run was `build-it-again-better` (worked example:
`private-source/professional/build-it-again-better/`: `draft.md`, `qa.md`, `research.md`, both articles,
`lines-by-agent.md` and `article-final.md`).

1. **Archive** the developer's draft verbatim as `private-source/<trips|projects|professional>/<slug>/draft.md` (ignored).
   Add his answers as `qa.md`, and any research about a client or product as `research.md`; none of it is public.
2. **Review, then ask.** Compare the draft with the evidence (Strava, the repository, the CV/LinkedIn, the existing
   entry). List unsupported claims, gaps and contradictions, and ask the developer. Never invent or infer; a claim without
   evidence is softened, cut, or flagged in `NEIL-TODO.md`. Ask where a number, a date or "who did what" is missing.
3. **Write two versions** beside the draft: `article-light-polish.md` and `article-narrative.md`, plus
   `lines-by-agent.md` listing every line you added so the developer can keep or drop it.
4. **Publish both for review as `draft: true` sibling entries** in the same collection (case study:
   `professional-case-study/entries/<slug>-a/index.md` and `-b`; project: `project/entries/<slug>-a/`; trip:
   `trip/entries/<slug>/light-polish.md` and `narrative.md`), so the real layout, relative assets and content
   transforms apply. Copy the real entry's frontmatter, set `draft: true`, and put each article beneath it. Drafts never
   generate public routes, list cards or related links, because the getters filter with `isPublished`.
   The review route is temporary and is not kept in the tree, so rebuild it from this recipe:
   - `src/pages/<section>/<slug>/review/[variant].astro` with `getStaticPaths` returning `a` and `b`. It reads both
     draft entries with `getCollection` (which includes drafts), throws if either is missing, and renders one with
     `render(entry)` inside the section's real layout (case studies: `ArticleLayout`, passing `noindex`). A `meta`
     slot holds the current version and a link to the other; never render both together.
   - Add an optional `noindex?: boolean` prop to `BaseLayout` (emit `<meta name="robots" content="noindex, nofollow" />`
     after the canonical link) and pass it through `ArticleLayout`.
   - Change `sitemap()` in `astro.config.ts` to `sitemap({filter: page => !page.includes("/review/")})`.
   - Give each version its own `<title>`, eyebrow and description: `validate:build` rejects duplicates, and this
     failed the first time. Put a comment at the top of the route naming everything to delete afterwards.
     Tell the developer the URLs (`pnpm dev`, then `/<section>/<slug>/review/a/` and `/b/`), and that the real page is unchanged.
5. **The developer chooses A or B and may edit the draft entry in place.** His edits live in
   `entries/<slug>-a/index.md`, not in the `private-source/` copy, so diff the two (`diff` against
   `article-light-polish.md`) and publish from the draft entry. Fix only clear typos and say which. Do not rewrite his
   wording, and do not silently reword a claim. Then, in the same pass:
   - write the chosen body under the real entry's frontmatter, updating `summary`, `seoDescription`, `technologies` and
     `dateModified`/`draft` as the schema requires, and drop any “initial outline” note;
   - save the final text as `private-source/<type>/<slug>/article-final.md`;
   - delete the review route folder, both draft entries, the `noindex` props (restore `BaseLayout` and
     `ArticleLayout` exactly, checking `git diff` against the index shows nothing) and the sitemap filter;
   - `grep -rn "/review/" src astro.config.ts` must find nothing, and `noindex` must remain only on the 404 page.
6. **Verify and track.** Run `pnpm format:check` (use `pnpm format -- AGENTS.md` for a scoped fix), `pnpm checks` and
   `pnpm build`. Then check `dist/`: the page has every heading, no review route or `noindex` exists, the sitemap has no
   review entry, and `grep -rli` for the anonymised names finds nothing in `src` and `dist`. Preview the final page at
   390 px and 1440 px for overflow, and report every gate result in the handoff. Approvals and open questions
   go to the developer there too.

Conventions for the questions in step 2: put unsupported claims in a table (claim, source, evidence needed), then
list story gaps as numbered questions so the developer can answer by number. Record his answers in `qa.md` in his wording. If
sources disagree (for example LinkedIn says “up to 4x” and the developer's answer says four weeks against four months), report
the disagreement instead of picking one, and drop any claim that appears only in an old skeleton.

**Professional case studies** also follow these rules:

- Anonymise fully: no employer, agency, client or product names, and no internal system names. Research about the
  client stays in `research.md`; describe the business generically (“a US lender specialising in second mortgages”).
- Every figure or superlative (“zero regressions”, “4x”, test counts, sizes) needs evidence from the developer stated in
  `qa.md`, and the copy says what it measures (an average, a representative case, his own experience).
- Prefer narrative headings and put the outcome near the top, as in the TQCC entry; see `WRITEUP-ADVICE.md`. There
  is no chapter mechanism for case studies, so a piece over about 1,600 words is a scope question for the developer.
- Neighbouring skeletons (`legacy-document-builder-replacement` and the other short entries) are still to be expanded
  the same way; keep their `sortOrder` and avoid repeating a claim another entry makes.
- Say what the evidence was (tests, comparisons, demos), not only that work was correct, and cross-link a related
  open-source project where it shows the same technique (for example Janggi's acceptance-test DSL).

## Adding or replacing a project screenshot

Use this workflow for a software case study whose image is a capture of a real website. The TQCC rides-page cover
(`src/content/project/entries/tqcc/_assets/tqcc-ride-schedule-page.png`) is the worked example.

1. **Capture the real page.** Use the current public page, or a reviewed local build when the public page is not
   the intended version. Do not recreate it with image generation and do not upscale the old screenshot. Confirm
   the exact route and visible state; ask the developer if the live page has changed materially from what the case study
   should preserve.
2. **Capture a high-resolution source.** Unless the existing composition calls for something else, use a 1200×630
   CSS viewport at 2× device scale for a 2400×1260 PNG. Wait for network idle and `document.fonts.ready` before
   capture. This keeps the established social-card ratio and gives Astro real source pixels for its current 1280px
   case-study derivative. Do not add a browser-automation dependency just for the capture; use the installed
   headless Chromium tooling.
3. **Inspect before publishing.** View the captured PNG at original detail. Check that the intended content is
   legible and complete and that it contains no private information, transient overlays, cookie prompts, browser
   chrome, or accidental focus/hover state. Keep a descriptive kebab-case filename, put it in the project's
   `_assets/` folder, and write alt text from the inspected pixels rather than from the filename.
4. **Verify the file.** Keep the source as lossless PNG. Inspect its dimensions and metadata; it must contain no
   EXIF, GPS, text, orientation, or embedded colour profile. A clean Chromium capture normally contains only the
   `IHDR`, `IDAT`, and `IEND` PNG chunks. Confirm the source is larger than the widest derivative requested by the
   consuming Astro components instead of relying on an upscale.
5. **Verify the result.** Run `pnpm checks` and `pnpm build`, inspect the generated image widths and formats, and
   preview the consuming case-study page at 390px phone and 1440px desktop widths. Check the actual selected
   responsive source, sharpness, crop, aspect ratio, and horizontal overflow. Report both gate outcomes and the
   rendered checks in the handoff. Lighthouse is not needed for an ordinary image-quality change.

## Adding a trip story

The developer pastes a first-person draft, often with `@filename` photo and video cues and a hero image. The same steps apply
to every trip; the first run was Belfast to Rotterdam 2023, whose `private-source/trips/belfast-rotterdam-2023/`
folder is the worked example.

1. **Archive.** Save the draft verbatim as `private-source/trips/<slug>/draft.md` beside the originals (ignored
   directory; nothing public). Read `editorial-notes.md` (the retained Strava notes) and the trip's `strava.json`.
2. **Review, then ask.** Compare the draft with Strava for dates, places and route. List gaps and anything that
   doesn't make sense, and put the questions to the developer (ferry ports, named places, why a decision was made, what made a
   photograph special). Never invent or infer events; fold his answers in as he gives them, in his own wording.
3. **Write two versions** beside the draft, unless the developer says otherwise: `article-light-polish.md` (his sentences and
   jokes, UK spelling, typos fixed, tidy emoji such as `:sweat-smile:` to 😅, section headings, captions in his voice)
   and `article-narrative.md` (same facts, restructured around a thread of lessons or themes). Say plainly which
   lines are yours; the developer chooses, and he can keep or drop individual additions. A pun that started as a typo stays,
   in quotes. Then publish both for review as in "Editorial review of long-form copy" (trip variants sit in
   `src/content/trip/entries/<slug>/` as `draft: true` siblings).
4. **Photos.** Look at every image (a small preview is enough) before writing its alt text; never guess from the
   filename. Describe each in `private-source/trips/<slug>/photos.json` (`source`, kebab-case `name`, `alt`) and run
   `pnpm trip:photos <slug>`. It outputs metadata-free 1,600 px JPEGs into `_assets/` and rejects a source under
   1,200 px, so ask for a full-resolution original instead of using a thumbnail. Check every output for private
   addresses, number plates, bystanders and mirror reflections.
5. **Videos.** Describe each clip in `videos.json` and run `pnpm trip:videos <slug>`: it writes an H.264/AAC MP4 (long
   edge 1,280 px, 30 fps, audio kept by default) and a poster to `public/trips/<slug>/`. Set `muteAudio: true` on an
   individual manifest entry when its published clip must have no audio. Phone footage carries GPS `location` tags;
   the script strips them and fails if any remain. Extract frames and look at them before writing alt text.
6. **Publish.** Copy the chosen article under the frontmatter of `src/content/trip/entries/<slug>/index.md`, keeping
   the cover and its `coverAlt`. One figure per line, with non-blank alt text and a caption: images as
   `![alt](./_assets/x.jpg "Caption")`, clips as `![alt](/trips/<slug>/x.mp4 "Caption")` (root-absolute; a relative
   `.mp4` is not processed). Videos use `preload="none"` with a poster and never autoplay. Every photo or video the developer
   selected — each `photos.json`/`videos.json` entry, and everything he tagged `@filename` in the draft — must end
   up in the published article; never process one into `_assets/`/`public/trips/<slug>/` and then quietly leave it
   out. If a selected photo or video is later cut, remove its manifest entry and delete the stale derivative in the
   same pass rather than leaving an orphaned file, and never cut or delete one the developer selected without asking him
   first.
7. **Split into chapters once it's long.** Split whenever the stretch between two rest/transition days would
   otherwise exceed roughly **1,600 words or 35 figures** (the reasoning and the Tokyo to Seoul calibration behind
   this number are in `WRITEUP-ADVICE.md`). Use the nearest rest day as the chapter boundary; only cut at an
   existing `##` heading instead when no rest day falls at a clean point inside an over-length stretch, and never
   invent, move or reword a heading purely to create a boundary. This is opt-in per trip — most trips are short
   enough to stay one page. Each chapter is its own
   `src/content/trip/entries/<slug>/part-<n>-<chapter-slug>.md`, matching the `tripChapters` collection's
   `*/part-*.{md,mdx}` glob, with `title`, `order`, `startDate`, `endDate`, `coverImage` (`./_assets/...`, reuse a
   photo already in that chapter rather than commissioning anything new), `coverAlt`, `seoDescription` and `draft`
   frontmatter (`src/content/trip/trip-chapter/TripChapterContent.ts`). The overview (`index.md`) keeps the trip's
   intro and its own first, shortest part. Chapter routing, the "Part n of N" heading, the contents list, prev/next
   links and route-map highlighting are all derived from this collection at build time, so re-splitting later (as
   happened when Tokyo to Seoul's six chapters became ten) needs no code changes, only content moves. Chapter
   titles and descriptions are new copy — flag them in the handoff like any other agent-written text.
8. **Verify.** Run `pnpm checks` and `pnpm build`, and confirm the built page has every figure, caption and video.
   `lighthouserc.json` lists only some routes, so audit a new trip page with a temporary config (see `pnpm lighthouse`). If the trip has chapters, check `lighthouserc.json` still points at the current
   heaviest chapter route, not one a later re-split renamed or removed. The developer may defer a failing LCP; report it
   rather than hiding it.
9. **Hand off.** Report the gate results and any open questions. The developer approves the copy, images and clips.
   Leave the index and history untouched.

## Design rules

- Follow the editorial-plus-outdoors direction already established in the site.
- Work mobile first: base utilities describe the small viewport, with breakpoint utilities adding only
  the larger-layout changes.
- Use the palette defined in `src/styles/global.css`: warm ecru `#F5F0E6`, ink navy `#18262D`,
  forest `#244B3B`, petrol `#1F5960`, copper `#98462F`, and moss `#7B8D6B`.
- Use copper sparingly so it complements rather than imitates the subject's hair. Use moss only for
  non-text decoration unless a specific pairing is independently shown to meet its contrast target.
- Validate contrast for the actual component states; token-level contrast is guidance, not a
  substitute for testing rendered UI.
- Style all markup with Tailwind utilities on the element; `src/styles/global.css` holds only
  `@font-face`, the `@theme` tokens, and a small `@layer base` for element defaults that Markdown content
  cannot carry classes for (headings, paragraphs, links, focus, disabled, forced colours). Do not add
  component or page classes there. Use theme tokens (`bg-paper`, `text-copper`, `max-w-copy`), not hex.
- Preflight zeroes margins and list styles, so restore them deliberately. Repeated markup becomes a
  component (`Container`, `Section`, `SectionHeading`, `Eyebrow`, `Button`, `Prose`) rather than a copied
  class list.
- Do not use negative margins. Group related elements with an explicit layout and tighter gap, widen a
  target with a pseudo-element, and position decorative overflow without changing document flow.
- Build state-dependent class lists with `class:list`: fixed classes as one string, each conditional as
  `flag && "class"`, never a template string or ternary. A variant prop picks exactly one of several
  conflicting utilities; do not pass a conflicting utility through `class`, because CSS order rather
  than attribute order wins.
- Set SVG geometry (`stroke-width`, `stroke-linecap`, `stroke-dasharray`) as attributes and colour with
  utilities.
- Use Newsreader for editorial headings, Inter for body/UI, and system monospace sparingly.
- Self-host fonts and keep the shipped font set small.
- Use real trip photography and project-owned imagery; do not add generic stock photos.
- Avoid astronaut/moon references, generic terminal aesthetics, neon gradients, and excessive animation.
- Meaningful content must remain available without client-side JavaScript.
- Respect `prefers-reduced-motion`, keyboard navigation, semantic HTML, and WCAG 2.2 AA contrast.

## SEO rules

- Canonical production origin is `https://neilarmstrong.dev`.
- Use one descriptive H1 per page and unique titles/descriptions.
- Emit absolute canonical and social-image URLs.
- Keep identity data in one typed configuration module.
- Reuse one stable Person `@id` across structured data.
- Link LinkedIn, GitHub, Strava, and Instagram through visible links and `sameAs`.
- Use only truthful structured data that matches visible content.
- Generate a canonical sitemap, cycling image sitemap, and `robots.txt`.
- Never add `meta keywords` or a `SearchAction` without a real site search.
- Optimise images through Astro, include dimensions, and use descriptive filenames and alt text.

## Quality expectations

Before handing off a change:

- Run the relevant check, test, and build commands once they exist.
- Lighthouse runs in its own workflow; run `pnpm lighthouse` locally when a change could affect performance.
- Verify mobile and desktop layouts for UI changes.
- Check accessibility for changed interactions and content.
- Confirm content-sensitive changes stay within the approved public/private boundary.
- Keep Lighthouse targets at SEO/accessibility/best practices ≥95 and performance ≥90.
- Preserve LCP below 2.5 seconds and CLS below 0.1 on representative mobile pages.
- Do not weaken tests, content validation, accessibility, or SEO checks to make CI pass.

## Git and deployment

- Do not create Git commits or alter the index unless the developer explicitly asks; they stage and commit
  themselves, and staged files remain editable.
- Target public repository: `neil-armstrong-fig/personal-site` (`origin`).
- Production hosting: GitHub Pages through `.github/workflows/deploy.yml`, with `public/CNAME` for the custom domain.
  `.github/workflows/lighthouse.yml` audits `dist/` separately.
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

Update `AGENTS.md` when any of the following becomes concrete:

- Exact package versions and supported Node version
- Actual scripts and test commands
- Final directory and component conventions
- Content schema invariants
- Image-processing workflow
- Copy/style guidance discovered during review
- CI and deployment details
- Any recurring failure mode or non-obvious project rule
