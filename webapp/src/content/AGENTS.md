# AGENTS.md — content

Markdown content collections (projects, professional case studies, trips) and the workflows they share. The loaders,
schemas and getters live beside the entries. Each type has its own audience, voice and workflow in its folder: read
that file as well as this one, and `WRITEUP-ADVICE.md` (in this folder) before drafting, reviewing, or restructuring
any write-up.

- `professional-case-study/AGENTS.md`: anonymised professional work, for people deciding whether to hire.
- `project/AGENTS.md`: open-source project write-ups and project screenshots.
- `trip/AGENTS.md`: cycling stories, photography, clips, Strava data and ride maps.

## Privacy and source material

`private-source/` is ignored working material. Only reviewed, sanitised derivatives and approved copy may enter the
public source tree. Anonymisation differs by type: professional work is fully anonymised, while trip write-ups name
people and organisations as the developer did.

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
- No social or third-party embeds, generic blog, résumé download, or CMS in v1. The only videos are short self-hosted
  trip clips, and the contact form is the one form.
- Every new or substantially rewritten long-form piece goes through "Editorial review of long-form copy" below.
  Comparison pages offer only A and B choices, never a “Both” or “Show both” option; the developer wants to review
  each version in isolation.
- The primary contact action is a LinkedIn message framed as “open to conversations,” not “actively looking.”

## Editorial review of long-form copy

One workflow for trips, open-source projects and professional case studies. The trip-specific mechanics are in
`trip/AGENTS.md`'s "Adding a trip story"; the first professional run was `build-it-again-better` (worked example:
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
   - delete the review route folder, both draft entries, the `noindex` props (restore `BaseLayout` and
     `ArticleLayout` exactly, checking `git diff` against the index shows nothing) and the sitemap filter;
   - `grep -rn "/review/" webapp/src webapp/astro.config.ts` must find nothing, and `noindex` must remain only on the 404 page.
6. **Verify and track.** Run `pnpm format:check` (use `pnpm format -- AGENTS.md` for a scoped fix), `pnpm checks` and
   `pnpm build`. Then check `webapp/dist/`: the page has every heading, no review route or `noindex` exists, the sitemap has no
   review entry, and `grep -rli` for the anonymised names finds nothing in `webapp/src` and `webapp/dist`. Preview the final page at
   390 px and 1440 px for overflow, and report every gate result in the handoff. Approvals and open questions
   go to the developer there too.

Conventions for the questions in step 2: put unsupported claims in a table (claim, source, evidence needed), then
list story gaps as numbered questions so the developer can answer by number. Record his answers in `qa.md` in his wording. If
sources disagree (for example LinkedIn says “up to 4x” and the developer's answer says four weeks against four months), report
the disagreement instead of picking one, and drop any claim that appears only in an old skeleton.
