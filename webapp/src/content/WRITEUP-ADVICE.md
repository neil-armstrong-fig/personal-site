# Write-up length and readability advice

Read this before drafting, reviewing, or restructuring any long piece of writing on the site: a trip story, a
software case study, a project write-up, or anything added later. It is reference material, not a workflow —
`trip/AGENTS.md`'s "Adding a trip story" and `project/AGENTS.md`'s "Adding or replacing a project screenshot" sections hold the actual
steps and file mechanics. This file exists so the reasoning behind those steps, and behind any future length
or structure decision, sits in one place instead of being re-researched or re-argued each time.

## What the research says

**People scan, they don't read.** NN/G's eye-tracking research across many studies found visitors read at most
28% of the words on an average page during a typical visit, and 20% is more realistic; they scan in an
F-shaped pattern, across the top, partway down a second line, then down the left edge hunting for subheadings,
bold text, and other anchors ([How Little Do Users Read?](https://www.nngroup.com/articles/how-little-do-users-read/)).
This argues for front-loading the point of a section rather than building to it, and for real subheadings a
scanner can navigate by, not just tone-setting section titles.

**Attention still front-loads even on a page people intend to read fully.** For a single scrolling article,
more than 65% of viewing time lands in the top 40% of the page
([Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)). The most important
framing, the thing that makes a reader keep going, belongs near the top, not as a pay-off after several
screens.

**Scrolling beats pagination for a single narrative.** Users find it easier to keep scrolling than to decide
whether to click through to a next page, and forcing an extra click on every page of a genuinely continuous
story tends to lose readers rather than better-organise them for them
([Users' Pagination Preferences and "View All"](https://www.nngroup.com/articles/item-list-view-all/)). This
is the reason a long write-up should be split at real seams in the content (a rest day, a change of place or
theme), not sliced into arbitrary equal-sized pages.

**An in-page table of contents works, and belongs near the top.** Anchors and jump-links are a legitimate
navigation aid for a long page, but only when placed where a reader sees them before committing to scroll, not
buried after several screens
([Anchors OK? Re-Assessing In-Page Links](https://www.nngroup.com/articles/in-page-links/);
[Table of Contents: The Ultimate Design Guide](https://www.nngroup.com/articles/table-of-contents/)).

**Multi-day travelogues conventionally split by day or leg.** crazyguyonabike's own author guidance is to give
each travel day its own page, specifically because each page can then carry its own date and distance
([crazyguyonabike.com Help](https://www.crazyguyonabike.com/website/help/index.html)) — the same instinct
behind this site's per-chapter stats.

**A length sweet spot exists, but it's a correlation with sharing, not a readability law.** BuzzSumo's
large-scale analyses found long-form content (upwards of 2,000 words) tends to attract more shares and links
than short posts, with very short posts underperforming most
([New Research: Content That Gets Links & Shares](https://buzzsumo.com/blog/magical-content-gets-links-shares-new-research-buzzsumo-majestic/)).
Treat this as evidence that length itself isn't the enemy of a good write-up, not as a target to hit — nothing
here says to pad a short, complete story out to 2,000 words.

**There's no fixed "right" number of images per post.** Jetpack's own guidance is that the real constraint is
load time and relevance, not a count: a page of ten small thumbnails can be fine where three oversized files
are not ([How Many Images Per Blog Post or Page? Is There a Limit?](https://jetpack.com/resources/how-many-images-is-too-many/)).
This matches the site's existing approach (lazy-loaded, responsive `astro:assets` images) — the number of
figures on a page matters mainly as a proxy for how heavy the page is to load, which is exactly why splitting a
very image-heavy trip chapter also has a genuine performance benefit, not just a readability one.

**`rel="prev"`/`rel="next"` are dead for SEO.** Google deprecated them in 2019
([Ahrefs: SEOs Are Breaking Pagination](https://ahrefs.com/blog/rel-prev-next-pagination/)); any future
paginated content should use visible prev/next links, with each page canonicalising to itself, rather than
building around those tags.

## The calibration point: Tokyo to Seoul

The developer confirmed "Arrival in Tokyo" (704 words, 12 figures) as a chapter that read as the right length. Measuring
every other chapter against that benchmark, and re-measuring after each split, gave a working number: chapters
that ended up in the roughly **900–1,650 word / 10–44 figure** range read fine; the ones still well above that
(originally 2,550–2,835 words / 62–64 figures) were the ones flagged as too heavy and subsequently split.
Words-per-figure stayed remarkably constant throughout — roughly one figure per 40–55 words — across both the
short and long chapters, so that ratio is not itself a useful signal; total length is. `trip/AGENTS.md`'s "Adding a
trip story" step 7 turns this into the concrete rule used when deciding whether, and where, to split a trip.

## Applying this beyond trips

Trips have a purpose-built mechanism for splitting into chapter pages (the `tripChapters` collection; see
`trip/AGENTS.md`). **Case studies and projects have no equivalent multi-page mechanism today** — don't build one
speculatively. If a case-study or project draft is running long enough that this research would suggest
splitting it, that is a scope question for the developer (a new content type, new routing, new schema) before any code
is written, not something to solve unilaterally the way a trip chapter split can be. Until then, apply the
scanning and front-loading findings above directly to the single page: put the decision or outcome near the
top rather than at the end, use real subheadings a reader could jump between, and keep individual sections
short enough to scan rather than relying on length alone to convey thoroughness.
