/**
 * Pages that exist to be handed to someone as a link, not found through search. Each is marked `noindex` on the page
 * itself and left out of the sitemap, so a crawler is never pointed at it. Paths end in a slash, as the sitemap writes them.
 */
const UNLISTED_PATHS: readonly string[] = ["/bc/"];

export function isUnlistedPath(pathname: string): boolean {
  return UNLISTED_PATHS.includes(pathname);
}

export function unlistedPaths(): readonly string[] {
  return UNLISTED_PATHS;
}
