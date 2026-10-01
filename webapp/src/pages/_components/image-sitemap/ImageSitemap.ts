import type {SitemapImage} from "@src/pages/_components/image-sitemap/types/SitemapImage";
import type {SitemapPage} from "@src/pages/_components/image-sitemap/types/SitemapPage";

export function buildImageSitemap(pages: SitemapPage[]): string {
  const entries = pages.filter(page => page.images.length > 0).map(buildUrlEntry);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
}

function buildUrlEntry(page: SitemapPage): string {
  return ["  <url>", `    <loc>${escapeXml(page.pageUrl)}</loc>`, ...page.images.map(buildImageEntry), "  </url>"].join(
    "\n",
  );
}

function buildImageEntry(image: SitemapImage): string {
  let title = "";

  if (image.title !== undefined) {
    title = `\n      <image:title>${escapeXml(image.title)}</image:title>`;
  }

  return `    <image:image>\n      <image:loc>${escapeXml(image.url)}</image:loc>${title}\n    </image:image>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
