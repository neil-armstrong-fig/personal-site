import {access} from "node:fs/promises";
import path from "node:path";

import {buildDirectory} from "@src/scripts/validate-build/build-output/BuildDirectory";
import {siteConfig} from "@src/site/SiteConfig";

export async function assertBuilt(reference: string, route: string): Promise<void> {
  const {pathname} = new URL(reference, `${siteConfig.origin}${route}`);
  const decoded = decodeURIComponent(pathname);
  let builtPath = decoded;

  if (decoded.endsWith("/")) {
    builtPath = `${decoded}index.html`;
  }

  try {
    await access(path.join(buildDirectory, builtPath));
  } catch {
    throw new Error(`${route} references missing built output: ${reference}`);
  }
}
