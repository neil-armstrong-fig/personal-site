import {readFile} from "node:fs/promises";
import path from "node:path";

import {assertBuilt} from "@src/scripts/validate-build/build-output/AssertBuilt";
import {buildDirectory} from "@src/scripts/validate-build/build-output/BuildDirectory";
import {siteConfig} from "@src/site/SiteConfig";

export async function assertSitemaps(): Promise<void> {
  const robots = await readFile(path.join(buildDirectory, "robots.txt"), "utf8");

  for (const sitemap of ["sitemap-index.xml", "sitemap-images.xml"]) {
    if (!robots.includes(`Sitemap: ${siteConfig.origin}/${sitemap}`)) {
      throw new Error(`robots.txt must reference ${sitemap}.`);
    }
  }

  const pageSitemap = await readFile(path.join(buildDirectory, "sitemap-0.xml"), "utf8");

  for (const entry of pageSitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = entry[1] ?? "";

    if (!/<lastmod>\d{4}-\d{2}-\d{2}/.test(block)) {
      throw new Error(
        `Sitemap entry ${/<loc>([^<]*)<\/loc>/.exec(block)?.[1] ?? block} must say when the page last changed.`,
      );
    }
  }

  const imageSitemap = await readFile(path.join(buildDirectory, "sitemap-images.xml"), "utf8");

  for (const match of imageSitemap.matchAll(/<image:loc>([^<]*)<\/image:loc>/g)) {
    const location = match[1] ?? "";

    if (!location.startsWith(`${siteConfig.origin}/`)) {
      throw new Error(`Image sitemap entry ${location} must be an absolute production URL.`);
    }

    await assertBuilt(new URL(location).pathname, "/sitemap-images.xml");
  }
}
