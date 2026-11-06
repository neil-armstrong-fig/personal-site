import {readFile} from "node:fs/promises";
import path from "node:path";

import {buildDirectory} from "@src/scripts/validate-build/build-output/BuildDirectory";
import {isPlaceholderPage} from "@src/scripts/validate-build/pending-pages/IsPlaceholderPage";
import {pendingSoftwareSlugs} from "@src/site/pending-pages/PendingPages";

/**
 * A slug on the pending list must still be a placeholder. Once its real page is published the entry has to come off the
 * list, or the sitemap keeps leaving the real page out.
 */
export async function assertPendingPages(): Promise<void> {
  for (const slug of pendingSoftwareSlugs()) {
    const html = await readFile(path.join(buildDirectory, "software", slug, "index.html"), "utf8");

    if (!isPlaceholderPage(html)) {
      throw new Error(
        `/software/${slug}/ is published now. Remove "${slug}" from src/site/pending-pages/PendingPages.ts so the sitemap includes it.`,
      );
    }
  }
}
