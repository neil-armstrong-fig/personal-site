# AGENTS.md — webapp

The Astro site, served statically from GitHub Pages at `https://neilarmstrong.dev`. Read `src/content/AGENTS.md`, and the `AGENTS.md` in the content type's folder, before
touching content, and `src/scripts/AGENTS.md` before touching a command-line script.

## Stack

Astro 7.3.4, TypeScript 6.0.3 strict (TypeScript 7 is deferred until Astro Check and typescript-eslint support it),
Tailwind CSS 4.3.3, Leaflet 1.9.4 with `@types/leaflet` for lazy, read-only cycling maps, Node.js 24.21.0, Astro content
collections for projects, anonymised case studies and trips, static output.

Prefer static Astro components and build-time work. Do not add React, Vue, a CMS, a further server runtime, a database,
or client-side state unless a concrete requirement justifies it and the developer approves the scope change. The contact
Worker (`workers/contact-worker/`) is the approved exception.

## Commands

Run from the repository root; the root package forwards to `webapp/`. The generic ones (`checks`, `lint`, `format`,
`test`) are in the root `AGENTS.md`.

- `pnpm dev` — local development, clearing the content cache first so content and schema changes are never stale
- `pnpm type-check` — Astro and TypeScript validation
- `pnpm build` — quality gate, production build, and built-output validation
- `pnpm validate:build` — validate built links and essential SEO invariants in `webapp/dist/`
- `pnpm indexnow:submit` — read the deployed canonical sitemap and notify IndexNow after a successful production
  deployment; the public validation key is `webapp/public/indexnow-key.txt`
- `pnpm strava:sync` — pull activities with the credentials in `.env`, keep raw responses in `private-source/`,
  and write a coordinate-free `strava.json` snapshot plus privacy-trimmed `routes.json` into each trip folder
- `pnpm strava:sync-media` — rate-limit and cache Strava activity photo lists and originals under
  `private-source/`, then write one inspected, metadata-free ride-log derivative per activity where available
- `pnpm trip:photos <trip-slug>` — turn the originals listed in `private-source/trips/<slug>/photos.json` into
  metadata-free 1,600 px JPEGs in the trip's `_assets/`, failing on any remaining EXIF/XMP/IPTC/ICC or a source
  under 1,200 px
- `pnpm trip:videos <trip-slug>` — the same for `videos.json`: metadata-free MP4s and posters in `webapp/public/trips/<slug>/`; the MP4s are gitignored, played locally by `pnpm dev`
  (`TRIP_VIDEOS_LOCAL=1`) and served in production from `https://media.neilarmstrong.dev/trips/<slug>/` once uploaded
  (uses the bundled `@ffmpeg-installer/ffmpeg`)
- `pnpm lighthouse` — Lighthouse CI against `webapp/dist/` (run `pnpm build` first): SEO/accessibility/best practices ≥95,
  performance ≥90, LCP ≤2.5 s (≤3 s for the heavy `tokyo-to-seoul` trip pages, set per URL in `assertMatrix`), CLS ≤0.1 on the mobile preset. It runs in its own workflow
  (`.github/workflows/lighthouse.yml`); run it locally for changes that could affect performance, not after every edit.
  Under WSL it picks up the Windows Chrome and cannot connect: set `CHROME_PATH` to Playwright's Linux Chromium
  (`~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome`) and run `pnpm --filter @personal-site/webapp exec lhci autorun` with
  `--collect.settings.chromeFlags="--no-sandbox --headless=new --disable-gpu --disable-dev-shm-usage"`.
  LCP is simulated on slow 4G, so it counts every request started before the observed paint, including lazy images
  near the viewport and ~131 KB of fonts: a page's budget is the `/about/` baseline (~1.8 s) plus its early bytes.
- `pnpm build` keeps Astro's content cache, so a change to a remark/rehype plugin needs `pnpm --filter @personal-site/webapp exec astro build --force`
  before the built HTML reflects it.
- `pnpm preview` — preview the production build

## Privacy of assets

The CV is private reference material only. Never publish, copy into `webapp/public/`, or commit it. Do not expose its phone number or personal email address.
The original portrait contains EXIF metadata including GPS data. Never commit or deploy the original.
The current public portrait derivative was made by removing all JPEG application and comment segments;
its compressed image data is byte-for-byte identical to the source scan. Verify every future derivative
contains no EXIF/GPS or other sensitive metadata and inspect its rendered output. Apply the same rule to
all trip photography.

## Import layering

Enforced by ESLint (`restrictedImports(...)` in `eslint.config.js`, never a raw `no-restricted-imports`; see the root file).

Keep source dependencies one-way, enforced by ESLint: `pages` may compose everything; `layouts` may
depend on shared components, content and site code; shared `components` may depend on content and site
code; `site` may depend on content; and `content` depends on none of those higher layers. `scripts` (command-line
tools) may depend on content, site and shared components, and nothing else may depend on `scripts`. A narrower
override must preserve both the layering rules and the parent-import restriction.

## File and folder structure

This follows the locality model in the [Janggi repository](https://github.com/neil-armstrong-fig/janggi) (its root `AGENTS.md` and `webapp/src/react/AGENTS.md`),
adapted to Astro. Locality over layers: a file's depth tells you its blast radius before you open it.

### Roots

- Conventional Astro roots are `webapp/src/assets`, `webapp/src/components`, `webapp/src/content`, `webapp/src/layouts`, `webapp/src/pages`,
  `webapp/src/scripts`, `webapp/src/site`, and `webapp/src/styles`.
- `webapp/src/components` holds only pure, generic components shared across the site, such as `Button`, `Container`,
  `Section` and `Prose`. Anything used by a single page lives in a `_components/` folder beside that page.
  Something shared by several pages rises to their nearest common parent folder (`webapp/src/pages/software/_components/`
  for two software routes); it reaches `webapp/src/components` only when it is generic enough to belong to no page at
  all. Being site-wide in spirit (a header, a portrait, a route flourish) is not enough. `webapp/src/layouts` holds layouts shared by several routes.
- Links inside a sentence use `InlineLink`, never a bare `<a>` or `ExternalLink` with a hand-written `{" "}`. Astro drops the
  newline between a word and an inline tag, so a link Prettier wraps onto its own line loses the space around it
  (`an<a>`). `InlineLink` writes the space itself (`spacing="around"` when a word follows, `"none"` after `(` or at the
  start of a line) and `validate:build` fails on any glued link. A double space is harmless, a missing one is not.
- A single-caller component still lives beside its caller, however site-wide it looks: the header, footer and
  skip link sit under `webapp/src/layouts/components/` because only `BaseLayout` renders them, and the home-only
  `Portrait`, `GridBackdrop` and `RouteLine` sit in `webapp/src/pages/_components/`. Shared code rises only when a
  second caller appears.
- Helpers follow the same rule: a builder called by one route sits beside that route, one shared by several
  routes sits in their common parent's `_components/`, and `webapp/src/site` keeps only what layouts, pages and
  content all genuinely share (`SiteConfig`, identifiers, URL builders).
- Moving a file rewrites its imports but not path strings. `import.meta.glob` patterns and the keys used to
  look results up must be root-absolute (`/src/content/trip/entries/*/strava.json`), never relative, so a move cannot
  silently empty them; after any move, check the built page content, not only that it compiled.
- Below a root, group by subject: `navigation/`, `identity/`, `seo/`, `software/`, `cycling/`.

### Placement: as close to the caller as possible

- A file lives as close to its caller as it can, in a subdirectory of it. A helper used by one file goes
  in a folder beneath it, never beside it.
- Something shared by two siblings rises to their nearest common ancestor and no further.
- A component used by one route lives in a `_components/` folder beside that route. Astro turns every
  file under `webapp/src/pages` into a route unless the path starts with an underscore, so this is the
  `components/` folder of Janggi's layout. Routes here are files, so `_components/` sits at the level of
  the route file or folder that uses it; when several routes share a component, it rises to the nearest
  common folder.
- Route files follow URL conventions (`index.astro`, `[slug].astro`, `404.astro`). Content slugs are
  kebab-case.

### The folder set

The same set of folders recurses at every level, and a folder appears only once something needs it:

```
webapp/src/pages/cycling/
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
  (`webapp/src/pages/cycling/_components/neighbours/types/Neighbours.ts`).
- **`utils/`** holds plain functions, with their tests, that only the enclosing component or module calls.
  It is the last resort: if the functions share a subject, prefer a subject-named folder
  (`measurements/`, `neighbours/`) beside the caller. Anything shared rises out of `utils/` to the
  nearest common ancestor's own `utils/` or subject folder.
- **Subject folders** (`<subject>/`) hold plain functions on one subject. Name a folder for its subject,
  not its shape: `neighbours/` and `measurements/` say what is inside; `helpers/`, `common/`, `misc/` and
  `styles/` describe form and leave a reader no wiser. Never create top-level `utils/`, `helpers/`,
  `common/` or `misc/` folders.
- **Content and loaders** stay together under `webapp/src/content/`, one folder per content type: `trip/`, `project/`
  and `professional-case-study/`. Each holds its schema factory, published-content getter, tests and helpers,
  with the Markdown in an `entries/<slug>/` subfolder. Trip-only code that pages or the build read (`strava/`
  snapshots, routes and ride media, `trip-figures/`) lives inside `trip/`; code only a script runs lives under
  `webapp/src/scripts/`. Anything all three types use, such as `IsPublished` and `SortNewestFirst`, lives in `webapp/src/content/shared/`.
- Split or rename a section on one side only if you do the same for anything that mirrors it.

### Files

- Components and TypeScript source files are PascalCase and name their single primary export. One export
  per file; a filename names what it exports.
- A unit test sits beside its subject as `Subject.test.ts`.
- A folder root is its table of contents: the handful of entry points that say what is in there stay at
  the top, and everything else drops into a subject-named subfolder. Roughly six unrelated files is a
  warning sign, not a hard limit.
- Add a nested `AGENTS.md` to a folder only once folder-specific guidance has accumulated there.

## Astro conventions

- Put one blank line between sibling elements in HTML, Astro templates, and TSX, at every nesting level.
- In Astro templates, express two render branches as separate `{condition && (...)}` and `{!condition && (...)}` blocks.

## Testing the site

- Do not add shallow Astro component tests, jsdom by default, or a Playwright acceptance-test suite.
- Validate pages through Astro compilation, the production build, generated-HTML assertions,
  accessibility/Lighthouse auditing, and manual phone/desktop review.

## Design rules

- Follow the editorial-plus-outdoors direction already established in the site.
- Work mobile first: base utilities describe the small viewport, with breakpoint utilities adding only
  the larger-layout changes.
- Use the palette defined in `webapp/src/styles/global.css`: cool off-white `#F4F7F6`, muted sage `#E1E9E6`, ink navy
  `#18262D`, forest `#244B3B`, petrol `#1F5960`, copper `#98462F`, and moss `#7B8D6B`.
- **Dark theme.** The same token names are overridden for dark (true black `#000000` page for OLED, tinted off-white
  ink at about 15:1 rather than 21:1, mid-spectrum greens and teals, no blue or saturated red), because pure white on pure
  black halates for astigmatism and automated contrast checks do not catch it. Dark follows `prefers-color-scheme`
  unless the footer toggle stores `light` or `dark` (`localStorage` key `theme`, applied as `data-theme` by a small
  inline script in `BaseLayout` before first paint). A link ending `?theme=dark` or `?theme=light` sets and remembers
  that choice, which is how to share a link that opens in dark (for example `https://neilarmstrong.dev/?theme=dark`).
  The two override blocks in `global.css` must stay identical. Check
  every new text pair in both themes, including translucent variants such as `text-on-fill/65`.
- Colour roles, not hues: a token that is both a text colour and a fill flips in opposite directions in dark, so use
  `bg-fill-ink`, `bg-fill-forest` and `bg-fill-petrol` for large dark fills (`bg-fill-footer` for the footer, which is black in dark so it does not merge with the sage section above it) with `text-on-fill` on them, `bg-action`,
  `hover:bg-action-hover` and `text-on-action` for buttons and other small controls (light in dark mode), and
  `border-line` for structural borders. Never put `bg-ink`, `bg-forest`, `bg-petrol` or `text-paper` on a fill.
  `text-paper` on `bg-copper` is the one correct use, because both flip together.
- Route maps stay a light panel in both themes (OpenStreetMap tiles are light), so their line colours are the fixed
  light values in `route-maps/leaflet/RouteMapPalette.ts`, and dark mode only dims the tile pane through
  `--map-tile-filter`. Lighthouse audits the light scheme only, so check dark by hand.
- Use copper sparingly so it complements rather than imitates the subject's hair. Use moss only for
  non-text decoration unless a specific pairing is independently shown to meet its contrast target.
- Validate contrast for the actual component states; token-level contrast is guidance, not a
  substitute for testing rendered UI.
- Style all markup with Tailwind utilities on the element; `webapp/src/styles/global.css` holds only
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
- Self-host fonts and keep the shipped font set small. The two woff2 files are the originals narrowed with fontTools
  `instancer`: weight limited to 400–700 (the `@font-face` range) and Inter's optical size pinned at 14, with every glyph
  kept. Newsreader keeps its optical-size axis because headings rely on it. Re-derive them that way rather than shipping
  the full variable fonts, since font bytes count directly against LCP.
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
- `/llms.txt` is generated from `siteConfig` and the published case study and project collections
  (`src/pages/llms.txt.ts`), so it cannot drift; never hand-write it.
- The About page's FAQ is one typed list (`about/_components/faq/FaqEntries.ts`) rendered visibly and emitted as
  `FAQPage` JSON-LD, so the two always match. Keep answers plain text, with no markup.
- Never add `meta keywords` or a `SearchAction` without a real site search.
- Optimise images through Astro, include dimensions, and use descriptive filenames and alt text.

## Quality expectations

Before handing off a change:

- Run the relevant check, test, and build commands once they exist.
- Lighthouse runs in its own workflow; run `pnpm lighthouse` locally when a change could affect performance.
- Verify mobile and desktop layouts for UI changes.
- Check accessibility for changed interactions and content.
- Confirm content-sensitive changes stay within the approved webapp/public/private boundary.
- Keep Lighthouse targets at SEO/accessibility/best practices ≥95 and performance ≥90.
- Preserve LCP below 2.5 seconds and CLS below 0.1 on representative mobile pages.
- Do not weaken tests, content validation, accessibility, or SEO checks to make CI pass.
