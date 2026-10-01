import {listMediaVideoUrls} from "@src/scripts/validate-build/media/ListMediaVideoUrls";

const checked = new Set<string>();

// A clip that plays in `pnpm dev` from `public/trips/` is easy to forget to upload; fail the build instead of
// deploying a page whose video 404s.
export async function assertMediaUploaded(html: string, route: string): Promise<void> {
  for (const url of listMediaVideoUrls(html)) {
    if (checked.has(url)) {
      continue;
    }

    checked.add(url);
    const response = await fetch(url, {method: "HEAD"});

    if (!response.ok) {
      throw new Error(
        `${route} references ${url}, which returned ${response.status}. Upload it to R2 (see webapp/src/content/trip/AGENTS.md).`,
      );
    }
  }
}
