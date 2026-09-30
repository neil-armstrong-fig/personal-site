import {tripVideoOrigin} from "@src/content/trip/trip-figures/video/TripVideoOrigin";

export function listMediaVideoUrls(html: string): string[] {
  const prefix = `src="${tripVideoOrigin}/`;
  const urls = [...html.matchAll(/\ssrc="([^"]*\.mp4)"/gi)]
    .map(match => match[1] ?? "")
    .filter(url => `src="${url}`.startsWith(prefix));

  return [...new Set(urls)];
}
