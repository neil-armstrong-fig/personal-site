# AGENTS.md — content

Markdown content collections (projects, professional case studies, blog posts, trips) and the workflows they share. The loaders,
schemas and getters live beside the entries. Each type has its own audience, voice and workflow in its folder: read
that file as well as this one, and `WRITEUP-ADVICE.md` (in this folder) before drafting, reviewing, or restructuring
any write-up.

- `professional-case-study/AGENTS.md`: professional work, named by default, for people deciding whether to hire.
- `project/AGENTS.md`: open-source project write-ups and project screenshots.
- `blog/AGENTS.md`: short software posts that sit beside the case studies, and how they are published.
- `trip/AGENTS.md`: cycling stories, photography, clips, Strava data and ride maps.

## Privacy and source material

`private-source/` is ignored working material. Only reviewed, sanitised derivatives and approved copy may enter the
public source tree. Naming differs by type: professional case studies name the employer or client unless the developer asks
for one to be anonymous (older entries stay anonymous), while trip write-ups name people and organisations as the
developer did.

## Content rules

- Use first-person UK English, with Oxford commas in prose, captions, and alt text.
- Keep copy concrete and avoid inflated marketing language.
- Define collection schemas through `webapp/src/content.config.ts`; keep each type's schema factory beside its
  focused unit tests in that type's folder under `webapp/src/content/`. Collection text and alt text must be non-blank.
- Parse content dates to `Date` and HTTP(S) links to `URL` at the schema boundary. Local content images
  must use Astro's `image()` schema helper.
- Draft content must not generate public routes or appear in lists or sitemaps.
- Each project or trip is a folder named for its slug (`webapp/src/content/project/entries/janggi/index.md`) holding its
  Markdown and an `_assets/` subfolder for the images only it uses, referenced relatively
  (`./_assets/hero.png`). Only shared images belong in `webapp/src/assets/`.
- No social or third-party embeds, résumé download, or CMS in v1. The blog is a section of short software posts, not a general-purpose blog. The only videos are short self-hosted
  trip clips, and the contact form is the one form.
- Every new or substantially rewritten long-form piece goes through "Editorial review of long-form copy" below.
  Comparison pages offer only A and B choices, never a “Both” or “Show both” option; the developer wants to review
  each version in isolation.
- The primary contact action is a LinkedIn message framed as “open to conversations,” not “actively looking.”

## Editorial illustrations

The software articles use SVG illustrations built with small Python drawing helpers (`text`, `rect`, `path`, and
`group`), then rendered to PNG in Chromium. The editable SVGs beside the case-study and blog PNGs and the Figma Sync hero are reference
implementations. Use this workflow when extending that style:

1. Read the article and check technical details against its implementation. Keep measured claims scoped to what they
   measure, and distinguish implemented behaviour from future ideas. Preserve the article body when adding artwork.
2. Work on one article at a time. Offer three concepts, then refine the selected direction with three variants when
   requested. Review one option at a time in standalone responsive HTML previews. Keep review files in temporary
   working space until a choice is made, and record the choice before moving to the next article.
3. Build an open composition with the site's paper, sage, ink, forest, petrol, and copper palette. Use Newsreader for
   headings and Inter for labels. Embed the self-hosted WOFF2 fonts in the SVG so rendering waits on the exact fonts,
   with their existing OFL licences retained. Reuse visual subjects such as documents, controls, building blocks, and
   devices where they explain the article.
4. Keep text outside illustrated boxes, screens, and controls. Put code directly on the page, highlight the relevant
   names or keywords, and verify snippets against the source. Make meaningful differences visible, such as basic grey
   rough screens becoming refined interfaces after review.
5. Draw separate compositions: 1600px wide for desktop and 780px wide for narrow screens, with height set by the content.
   Rearrange the flow and wrap code for the narrow version. Keep code semantics and values identical across layouts.
6. Load each SVG in Chromium, await `document.fonts.ready`, set the viewport to its `viewBox` dimensions, and capture a
   lossless PNG at that size. Inspect both compositions for clipping, overlaps, text inside illustrated boxes, connector
   routing, and legibility. Check responsive previews at 390px and 1440px and verify PNGs contain only image chunks.
7. Save the selected wide and `-mobile` SVG/PNG pairs in the entry's `_assets/` folder with descriptive filenames. Remove
   option letters from production artwork. Use matching alt text and Astro image optimisation. Blog and professional
   entry headers use `diagram` metadata and the shared `ArticleDiagram` component, which swaps compositions below 48rem.
   Project heroes can supply `heroImageMobile` alongside `heroImage` for the same responsive figure. For body figures,
   follow `build-it-again-better`: local Markdown images inside theme and breakpoint wrappers preserve Astro optimisation.
   Keep HTML wrapper tags flush left: four-space indentation after a Markdown image becomes a visible code block.
   Use one body figure by default, adding a second only when the article needs it. Keep existing header artwork.
8. Keep card thumbnails in a fixed 16:10 frame with the full wide artwork centred using `object-contain` and the
   active paper background. Article figures retain their natural proportions. Never crop diagram labels to align cards.
9. Derive dark artwork from the editable SVG, preserving all geometry, text, and dimensions. Use a black canvas,
   dark sage surfaces, soft ink (`#D6DEDB`), mint (`#8FC4A8`), teal (`#6FB0B8`), and copper (`#D9967E`). Assign colours
   by role: a dark text colour becomes light text, while a large filled surface stays dark. Keep neutral rough screens
   distinct from refined controls. Inspect each article's wide and narrow pair before moving to the next.
10. Save `-dark` and `-mobile-dark` SVG/PNG pairs. Diagram metadata uses `imageDark` and `mobileImageDark`. Project
    heroes use `heroImageDark` and `heroImageMobileDark`. The shared `ThemedImage` renderer honours the footer's theme
    override as well as the system preference. Check both themes at 390px and 1440px, text and connector clearance,
    contrast, and identical light/dark proportions. Preserve original code strings when wrapping narrow snippets.

## Voice: sound like the developer, not an assistant

Applies to every word on the site, including page copy, FAQ answers, meta descriptions and alt text, not only long-form
entries. Before writing, read two or three existing entries (`build-it-again-better`, `serverless-insurance` and
`project/entries/janggi` are good models) and match them.

His voice, as the published entries show it:

- Short, plain sentences, first person, with contractions ("doesn't", "I'm", "it's").
- Concrete over general: a number, a tool, a duration or a named decision in preference to an adjective.
- A little dry humour, an honest aside, or a direct question the page then answers ("So how do you make sign-up easy?").
- A plain opinion stated as one ("Insurance can be a slow business, but that isn't the business I'm in").
- Hedged where he is unsure ("I believe", "partly, I think") and silent where there is no evidence.

Tells that make copy read as machine-written. Do not use them in new copy:

- **Em dashes.** The published entries contain none. Use a full stop, a comma or a colon. A dash already in the
  developer's own wording stays; do not add more or "tidy" it.
- **Semicolons** joining two clauses. Use two sentences.
- **Contrast framing**: "not X, but Y", "more than just X", "X rather than Y" as a stock rhythm, and "not an
  afterthought" style asides. State the point once, directly.
- **Reflexive triplets** and lists padded to three, and "whether you're X or Y" openers.
- **Inflated or filler words**: seamless, robust, leverage, delve, crucial, pivotal, landscape, journey (when not a
  literal journey), cutting-edge, passionate, deeply, truly, "world-class", "at its core".
- **Self-praise phrased as modesty**: "I'm just as comfortable", "I'm at my best", "I pride myself". Say what was
  done and let the figure or outcome carry it.
- **Tidy closing lines** that restate the paragraph, and a summary sentence after every section.
- **Uniform rhythm**: paragraph after paragraph of similar length, or a bold lead-in on every item. Vary it as the
  existing entries do.
- **A one-word answer followed by a neat explanation** ("Both.", "Absolutely.") as a habit. Use it where it is the
  honest answer, not as a template.

Before handing copy over:

1. `grep -n "—\|;" <changed files>` over the new copy and remove the hits that are not the developer's own.
2. Read the new text next to an existing entry. If it is smoother, more balanced or more adjective-heavy than its
   neighbour, it is probably wrong; roughen it.
3. Every claim must trace to a published entry or to `qa.md`. Name the source in the handoff and flag any wording the
   developer should confirm. Do not invent a quantity, a capability or a "since" date to fill a template.
4. Oxford commas stay, per the rule above, even where an existing entry omits them.

## Editorial review of long-form copy

One workflow for trips, open-source projects and professional case studies. The trip-specific mechanics are in
`trip/AGENTS.md`'s "Adding a trip story"; the first professional run was `build-it-again-better` (worked example:
`private-source/professional/build-it-again-better/`: `draft.md`, `qa.md`, `research.md`, both articles,
`lines-by-agent.md` and `article-final.md`).

1. **Archive** the developer's draft verbatim as `private-source/<trips|projects|professional|blog>/<slug>/draft.md` (ignored).
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
   - `webapp/src/pages/<section>/<slug>/review/[variant].astro` with `getStaticPaths` returning `a` and `b`. It reads both
     draft entries with `getCollection` (which includes drafts), throws if either is missing, and renders one with
     `render(entry)` inside the section's real layout (case studies: `ArticleLayout`, passing `noindex`). A `meta`
     slot holds the current version and a link to the other; never render both together.
   - Add an optional `noindex?: boolean` prop to `BaseLayout` (emit `<meta name="robots" content="noindex, nofollow" />`
     after the canonical link) and pass it through `ArticleLayout`.
   - Change `sitemap()` in `webapp/astro.config.ts` to `sitemap({filter: page => !page.includes("/review/")})`.
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
   - delete the review route folder, both draft entries, the `noindex` prop you added to `ArticleLayout` (restore it
     exactly, checking `git diff` against the index shows nothing) and the review clause of the sitemap filter.
     `BaseLayout` keeps its `noindex` and `bare` props, which the 404 and `/bc/` use, and the filter keeps `isUnlistedPath`;
   - `grep -rn "/review/" webapp/src webapp/astro.config.ts` must find nothing, and `noindex` must remain only on the 404 page
     and `/bc/`.
6. **Verify and track.** Run `pnpm format:check` (use `pnpm format -- AGENTS.md` for a scoped fix), `pnpm checks` and
   `pnpm build`. Then check `webapp/dist/`: the page has every heading, no review route exists, `noindex` appears only on the 404 and `/bc/`, the sitemap has no
   review entry, and `grep -rli` for any names the developer asked to keep anonymous finds nothing in `webapp/src` and `webapp/dist`. Preview the final page at
   390 px and 1440 px for overflow, and report every gate result in the handoff. Approvals and open questions
   go to the developer there too.

Conventions for the questions in step 2: put unsupported claims in a table (claim, source, evidence needed), then
list story gaps as numbered questions so the developer can answer by number. Record his answers in `qa.md` in his wording. If
sources disagree (for example LinkedIn says “up to 4x” and the developer's answer says four weeks against four months), report
the disagreement instead of picking one, and drop any claim that appears only in an old skeleton.
