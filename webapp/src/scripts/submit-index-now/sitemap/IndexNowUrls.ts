interface SitemapEntry {
  readonly location: string;
  /** What the sitemap says the page last changed, or nothing where it says none. */
  readonly lastModified: string | undefined;
}

/**
 * The canonical URLs in the deployed sitemap, to tell IndexNow about. IndexNow asks for the pages that changed and
 * not the whole site, so given `changedSince` (a day, as `2026-11-01`) it keeps the ones the sitemap dates on or after
 * it, and a page with no date, since nothing says it has not changed. Every entry is still checked against the origin,
 * changed or not.
 */
export function extractIndexNowUrls(sitemap: string, expectedOrigin: string, changedSince?: string): string[] {
  const entries = sitemapEntriesOf(sitemap);

  if (entries.length === 0) {
    throw new Error("The deployed sitemap contains no canonical URLs.");
  }

  const urls: string[] = [];

  for (const entry of entries) {
    const url = new URL(entry.location);

    if (url.origin !== expectedOrigin) {
      throw new Error(`Sitemap URL ${url.href} does not belong to ${expectedOrigin}.`);
    }

    if (hasChangedSince(entry, changedSince)) {
      urls.push(url.href);
    }
  }

  return urls;
}

function sitemapEntriesOf(sitemap: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  for (const block of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/gu)) {
    const location = /<loc>([^<]+)<\/loc>/u.exec(block[1] ?? "")?.[1];

    if (location === undefined) {
      continue;
    }

    entries.push({location, lastModified: /<lastmod>([^<]+)<\/lastmod>/u.exec(block[1] ?? "")?.[1]});
  }

  return entries;
}

/** Days compare as text, so a full timestamp that begins with the day counts as that day. */
function hasChangedSince(entry: SitemapEntry, changedSince: string | undefined): boolean {
  if (changedSince === undefined || entry.lastModified === undefined) {
    return true;
  }

  return entry.lastModified >= changedSince;
}
