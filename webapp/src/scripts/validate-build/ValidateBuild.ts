import {readFile} from "node:fs/promises";

import {assertBuilt} from "@src/scripts/validate-build/build-output/AssertBuilt";
import {buildDirectory} from "@src/scripts/validate-build/build-output/BuildDirectory";
import {assertRequestedCopy} from "@src/scripts/validate-build/copy/AssertRequestedCopy";
import {assertCyclingOutput} from "@src/scripts/validate-build/cycling/AssertCyclingOutput";
import {findHtmlFiles} from "@src/scripts/validate-build/html-files/FindHtmlFiles";
import {routeForHtmlPath} from "@src/scripts/validate-build/html-files/RouteForHtmlPath";
import {assertUniquePageProperties} from "@src/scripts/validate-build/page-summary/AssertUniquePageProperties";
import type {PageSummary} from "@src/scripts/validate-build/page-summary/types/PageSummary";
import {assertRouteData} from "@src/scripts/validate-build/route-data/AssertRouteData";
import {assertMediaUploaded} from "@src/scripts/validate-build/media/AssertMediaUploaded";
import {assertSitemaps} from "@src/scripts/validate-build/sitemaps/AssertSitemaps";

// Checks only what the compiler cannot: properties across pages and the built files themselves. Tags that
// BaseLayout always emits are guaranteed by its source, not re-asserted here.
await validateBuild();

async function validateBuild(): Promise<void> {
  const pages: PageSummary[] = [];

  for (const htmlPath of await findHtmlFiles(buildDirectory)) {
    const html = await readFile(htmlPath, "utf8");
    const route = routeForHtmlPath(htmlPath, buildDirectory);
    const h1Count = [...html.matchAll(/<h1\b/gi)].length;

    if (h1Count !== 1) {
      throw new Error(`${route} must contain exactly one <h1>; found ${h1Count}.`);
    }

    pages.push({
      route,
      title: firstMatch(html, /<title>([^<]*)<\/title>/i),
      description: firstMatch(html, /<meta name="description" content="([^"]*)"/i),
      canonical: firstMatch(html, /<link rel="canonical" href="([^"]*)"/i),
    });

    for (const reference of localReferences(html)) {
      await assertBuilt(reference, route);
    }

    await assertRouteData(html, route);
    assertRequestedCopy(html, route);
    assertCyclingOutput(html, route);
    await assertMediaUploaded(html, route);
  }

  assertUniquePageProperties(pages);
  await assertSitemaps();
  await assertBuilt("/indexnow-key.txt", "/indexnow-key.txt");
  await assertBuilt("/llms.txt", "/llms.txt");
}

function firstMatch(html: string, pattern: RegExp): string {
  return pattern.exec(html)?.[1] ?? "";
}

function localReferences(html: string): string[] {
  return [...html.matchAll(/\s(?:href|src)="([^"]*)"/gi)]
    .map(match => match[1] ?? "")
    .filter(reference => !/^(#|data:|mailto:|tel:|https?:)/.test(reference) && reference !== "");
}
