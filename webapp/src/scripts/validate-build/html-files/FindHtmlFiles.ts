import {readdir} from "node:fs/promises";
import path from "node:path";

import {isSiteVerificationFile} from "@src/scripts/validate-build/html-files/site-verification/IsSiteVerificationFile";

/** The built pages: every `.html` file except the ones a search engine asks for to prove ownership. */
export async function findHtmlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, {withFileTypes: true, recursive: true});
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith(".html") && !isSiteVerificationFile(entry.name))
    .map(entry => path.join(entry.parentPath, entry.name));
}
