# AGENTS.md — blog

Short software posts that sit beside the professional case studies. They are opinion and technique pieces in the
developer's voice. Shared rules (voice, tells, privacy, evidence) are in `../AGENTS.md`: read it first.

## Shape

- A post is `entries/<slug>/index.md` with an optional `_assets/` folder. Schema: `BlogPostContent.ts`. A post uses
  `datePublished` (and `dateModified` when edited), `topics`, `draft`, and an optional `homepageOrder`.
- An optional `diagram` supplies local `image` and `mobileImage` paths plus non-blank `alt` text. The article figure
  uses the stacked phone composition below 48rem and the wide composition above it, optimised by Astro with dimensions
  on both sources. Optional `imageDark` and `mobileImageDark` supply matching dark versions. Keep editable SVGs and
  rendered PNGs in the post's `_assets/` folder. Card thumbnails contain the wide artwork in a fixed 16:10 frame.
  Other posts need no diagram metadata.
- Aim for about 600 to 1,000 words. A post names its examples and links to the case study that shows them.
- Every claim traces to the developer's answers in `private-source/blog/<slug>/qa.md`. Do not invent a quantity, an
  experience or a "we" that he has not stated. Mark an aspiration as one ("my hope is").
- Related ideas are cited from primary sources, with the page checked recorded in `research.md`.
- Naming follows the case-study rule: a client is named only once the developer has said so and any client approval is in.
  A colleague is credited only with the developer's go-ahead, recorded in `qa.md`.

## Where posts appear

- There is no "Blog" item in `navigation`, by the developer's choice. Published posts are listed in the "How I like to
  build software" section of `/software/` (the `#blog` anchor, labelled "Opinions" in the section rail), which renders only while at least one post is published.
- `homepageOrder` (positive integer) also puts a post on the home page, lowest first, and the strip shows at most two (`HOMEPAGE_BLOG_POST_LIMIT`). That strip renders only when a
  published post has one, and links on to `/software/#blog`.
- There is no `/blog/` index. It redirects to `/software/#blog` (the `redirects` option in `astro.config.ts`), and a post's
  breadcrumb is Home > Software > Post. Post pages keep their `/blog/<slug>/` URLs so no indexed link breaks.
- `/llms.txt` gains a "Blog" section automatically, and only when a post is published.

## Publishing a post

1. Set `draft: false` and confirm `datePublished`.
2. Any link to a page that does not exist fails `validate:build`, because it checks every internal link against the built
   pages. A draft builds no page, so the draft itself is safe, but the links around it are not. Before publishing:
   - remove any newly published case study from the temporary list in `site/pending-pages/PendingPages.ts`. Pending
     entries serve a "Coming soon" placeholder that is not indexed, included in the sitemap, or listed. Set `draft: false`
     and remove its pending slug together. The build rejects published slugs left in that list.
   - add the link back to the post from each published case study it cites, which only works once the post is published.
3. `<!-- TODO -->` comments left in the body are harmless: they reach the HTML but nobody sees them. Resolve them when
   the post they point to exists. Posts that link to each other (`fuzzy-frontend` and `code-system`) publish together.
4. Run `pnpm checks` and `pnpm build`, then check `webapp/dist/blog/<slug>/`, `webapp/dist/software/index.html` and the
   sitemap entry.
