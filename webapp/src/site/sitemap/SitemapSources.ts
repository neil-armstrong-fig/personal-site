const PROJECTS = "src/content/project/entries";
const CASE_STUDIES = "src/content/professional-case-study/entries";
const TRIPS = "src/content/trip/entries";

/** Pages with one folder of their own and nothing else behind them. */
const STANDALONE_PAGES: readonly string[] = ["about", "contact", "privacy"];

const HOME_SOURCES: readonly string[] = [
  "src/pages/index.astro",
  "src/pages/_components",
  PROJECTS,
  CASE_STUDIES,
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
  if (STANDALONE_PAGES.includes(section) && slug === undefined) return [`src/pages/${section}`];

  return undefined;
}

function softwareSources(slug: string | undefined, chapter: string | undefined): readonly string[] | undefined {
  if (chapter !== undefined) return undefined;

  if (slug === undefined) {
    return ["src/pages/software/index.astro", "src/pages/software/_components", PROJECTS, CASE_STUDIES];
  }

  return [
    "src/pages/software/[slug].astro",
    "src/pages/software/_components",
    `${PROJECTS}/${slug}`,
    `${CASE_STUDIES}/${slug}`,
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
