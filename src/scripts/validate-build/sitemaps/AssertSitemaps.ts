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

  const imageSitemap = await readFile(path.join(buildDirectory, "sitemap-images.xml"), "utf8");

  for (const match of imageSitemap.matchAll(/<image:loc>([^<]*)<\/image:loc>/g)) {
    const location = match[1] ?? "";

    if (!location.startsWith(`${siteConfig.origin}/`)) {
      throw new Error(`Image sitemap entry ${location} must be an absolute production URL.`);
    }

    await assertBuilt(new URL(location).pathname, "/sitemap-images.xml");
  }
}
