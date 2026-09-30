import {readFile} from "node:fs/promises";
import path from "node:path";

import {assertBuilt} from "@src/scripts/validate-build/build-output/AssertBuilt";
import {buildDirectory} from "@src/scripts/validate-build/build-output/BuildDirectory";
import {assertContains} from "@src/scripts/validate-build/html/AssertContains";
import {assertNotContains} from "@src/scripts/validate-build/html/AssertNotContains";
import {matchCount} from "@src/scripts/validate-build/html/MatchCount";
import {isTripRouteMapManifest} from "@src/scripts/validate-build/route-data/IsTripRouteMapManifest";
import {siteConfig} from "@src/site/SiteConfig";

export async function assertRouteData(html: string, route: string): Promise<void> {
  const references = [...new Set(routeDataReferences(html))];
  let ferryCount = 0;

  for (const reference of references) {
    await assertBuilt(reference, route);
    const {pathname} = new URL(reference, `${siteConfig.origin}${route}`);
    const source = await readFile(path.join(buildDirectory, decodeURIComponent(pathname)), "utf8");
    const manifest: unknown = JSON.parse(source);

    if (!isTripRouteMapManifest(manifest)) {
      throw new Error(`${route} references an invalid trip route manifest: ${reference}`);
    }

    ferryCount += manifest.ferries.length;
  }

  const ferryMetadataCount = matchCount(html, /\sdata-trip-ferry-route(?:\s|>)/g);

  if (ferryMetadataCount !== ferryCount) {
    throw new Error(`${route} renders ${ferryMetadataCount} ferries but its route manifests contain ${ferryCount}.`);
  }

  if (ferryCount > 0) {
    assertContains(html, "Ferr", route);

    if (/^\/cycling\/[^/]+\/([^/]+\/)?$/.test(route)) {
      assertNotContains(html, "data-trip-ferry-note", route);
      assertNotContains(html, "data-trip-ferry-source", route);
    } else {
      assertContains(html, "data-trip-ferry-note", route);
    }
  }

  if (html.includes("data-ferry-points")) {
    throw new Error(`${route} must not expose ferry geometry in generated HTML.`);
  }
}

function routeDataReferences(html: string): string[] {
  return [...html.matchAll(/\sdata-routes-url="([^"]*)"/gi)].map(match => match[1] ?? "");
}
