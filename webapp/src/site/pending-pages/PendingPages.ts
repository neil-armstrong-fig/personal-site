/**
 * Software pages that other pages link to before they exist. Each gets a placeholder page (not indexed, not in the
 * sitemap, not in any list) until a published entry with the same slug replaces it.
 *
 * Keep this list short and temporary. Delete a slug once its page is published: the build fails and says so if you forget.
 */
const PENDING_SOFTWARE_SLUGS: readonly string[] = [];

/** The pending slugs that still need a placeholder, because no published page carries that slug yet. */
export function selectPlaceholderSlugs(publishedIds: readonly string[]): string[] {
  return PENDING_SOFTWARE_SLUGS.filter(slug => !publishedIds.includes(slug));
}

export function isPendingSoftwarePath(pathname: string): boolean {
  return PENDING_SOFTWARE_SLUGS.some(slug => pathname === `/software/${slug}/`);
}

export function pendingSoftwareSlugs(): readonly string[] {
  return PENDING_SOFTWARE_SLUGS;
}
