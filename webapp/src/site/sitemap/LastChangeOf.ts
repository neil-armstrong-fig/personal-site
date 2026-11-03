import {execFileSync} from "node:child_process";
import {join} from "node:path";

/** The webapp folder, three above this one: what the sources are relative to. */
const WEBAPP_ROOT = join(import.meta.dirname, "..", "..", "..");

/**
 * The day of the last commit that touched any of these sources. A checkout cut short, as CI's is unless it fetches the
 * whole history, names its one commit for everything, and a folder with no history at all (a tarball, a page not yet
 * committed) is dated today. Both are valid dates, and the build job asks for the whole history so the first is not
 * what ships. A source is matched literally, because a route such as `[slug].astro` is otherwise a pattern.
 */
export function lastChangeOf(sources: readonly string[]): string {
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...sources.map(literal)], {
      cwd: WEBAPP_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (date !== "") return date;
  } catch {
    // Not a clone: fall through to today.
  }

  return new Date().toISOString().slice(0, 10);
}

function literal(source: string): string {
  return `:(literal)${source}`;
}
