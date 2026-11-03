/**
 * Whether a built file is one a search engine asked to be served to prove the site is ours (Naver's is named
 * `naver` and 32 hex digits). It is not a page: it has no heading, title or canonical, and is not in the sitemap, so
 * the page checks must not be run on it. Anything else ending in `.html` is a page and is still checked.
 */
export function isSiteVerificationFile(fileName: string): boolean {
  return /^naver[0-9a-f]{32}\.html$/u.test(fileName);
}
