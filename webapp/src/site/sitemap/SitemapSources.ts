const PROJECTS = "src/content/project/entries";
const CASE_STUDIES = "src/content/professional-case-study/entries";
const BLOG_POSTS = "src/content/blog/entries";
const TRIPS = "src/content/trip/entries";

/** Shared page components that more than one section draws, so a change to one re-dates every page that uses it. */
const ARTICLE_LAYOUT = "src/pages/_components/article-layout";
const SECTION_NAV = "src/pages/_components/section-nav";
const CARD_RAIL = "src/pages/_components/card-rail";
const BLOG_POST_CARD = "src/pages/_components/blog-post-card";
const BLOG_POST_DATE = "src/pages/_components/blog-post-date";

/** Pages with one folder of their own and nothing else behind them. */
const STANDALONE_PAGES: readonly string[] = ["about", "contact", "privacy"];

const HOME_SOURCES: readonly string[] = [
  "src/pages/index.astro",
  "src/pages/_components",
  PROJECTS,
  CASE_STUDIES,
  BLOG_POSTS,
  TRIPS,
];

/**
 * What a page in the sitemap is made of, relative to the webapp folder: the route that draws it and the content that
 * fills it. The last commit to touch any of these is when the page last changed, which is the date the sitemap gives
 * it. An index counts the whole folder of entries it lists, so adding one is a change to it, and a page whose route this
 * does not know throws rather than being dated by a guess.
 */
export function sitemapSourcesOf(pathname: string): readonly string[] {
  const [section, slug, chapter, ...deeper] = pathname.split("/").filter(segment => segment !== "");

  if (deeper.length === 0) {
    const sources = sourcesOfSection(section, slug, chapter);
    if (sources) return sources;
  }

  throw new Error(`${pathname} is in the sitemap but SitemapSources does not know what it is made of.`);
}

function sourcesOfSection(
  section: string | undefined,
  slug: string | undefined,
  chapter: string | undefined,
): readonly string[] | undefined {
  if (section === undefined) return HOME_SOURCES;
  if (section === "software") return softwareSources(slug, chapter);
  if (section === "cycling") return cyclingSources(slug, chapter);
  if (section === "blog") return blogSources(slug, chapter);
  if (STANDALONE_PAGES.includes(section) && slug === undefined) return [`src/pages/${section}`];

  return undefined;
}

function softwareSources(slug: string | undefined, chapter: string | undefined): readonly string[] | undefined {
  if (chapter !== undefined) return undefined;

  if (slug === undefined) {
    return [
      "src/pages/software/index.astro",
      "src/pages/software/_components",
      SECTION_NAV,
      CARD_RAIL,
      BLOG_POST_CARD,
      BLOG_POST_DATE,
      PROJECTS,
      CASE_STUDIES,
      BLOG_POSTS,
    ];
  }

  return [
    "src/pages/software/[slug].astro",
    "src/pages/software/_components",
    ARTICLE_LAYOUT,
    `${PROJECTS}/${slug}`,
    `${CASE_STUDIES}/${slug}`,
  ];
}

function blogSources(slug: string | undefined, chapter: string | undefined): readonly string[] | undefined {
  if (chapter !== undefined) return undefined;

  // /blog/ is only a redirect to /software/#blog, so it has no sources and is never in the sitemap.
  if (slug === undefined) return undefined;

  return [
    "src/pages/blog/[slug].astro",
    "src/pages/blog/_components",
    ARTICLE_LAYOUT,
    BLOG_POST_CARD,
    BLOG_POST_DATE,
    `${BLOG_POSTS}/${slug}`,
  ];
}

function cyclingSources(slug: string | undefined, chapter: string | undefined): readonly string[] {
  if (slug === undefined) {
    return ["src/pages/cycling/index.astro", "src/pages/cycling/_components", TRIPS];
  }

  if (chapter === undefined) {
    return ["src/pages/cycling/[slug].astro", "src/pages/cycling/_components", `${TRIPS}/${slug}`];
  }

  return ["src/pages/cycling/[slug]/[chapter].astro", "src/pages/cycling/_components", `${TRIPS}/${slug}`];
}
