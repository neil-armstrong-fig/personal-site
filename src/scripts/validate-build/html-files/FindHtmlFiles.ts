import {readdir} from "node:fs/promises";
import path from "node:path";

export async function findHtmlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, {withFileTypes: true, recursive: true});
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith(".html"))
    .map(entry => path.join(entry.parentPath, entry.name));
}
