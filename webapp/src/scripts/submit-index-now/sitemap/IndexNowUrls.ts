export function extractIndexNowUrls(sitemap: string, expectedOrigin: string): string[] {
  const urls: string[] = [];

  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)) {
    const location = match[1];

    if (location === undefined) {
      continue;
    }

    const url = new URL(location);

    if (url.origin !== expectedOrigin) {
      throw new Error(`Sitemap URL ${url.href} does not belong to ${expectedOrigin}.`);
    }

    urls.push(url.href);
  }

  if (urls.length === 0) {
    throw new Error("The deployed sitemap contains no canonical URLs.");
  }

  return urls;
}
