const gluedBefore = /[A-Za-z0-9,;:’)]<a\b[^>]{0,20}/;
const gluedAfter = /<\/a>[A-Za-z0-9’(][^<]{0,10}/;

// Astro drops a newline between a word and an inline tag, so a link Prettier wrapped onto its own line can lose the
// space around it. Prose links go through InlineLink, which writes the space explicitly.
export function assertLinkSpacing(html: string, route: string): void {
  const before = gluedBefore.exec(html);

  if (before !== null) {
    throw new Error(`${route} has a link with no space before it: ${before[0]}`);
  }

  const after = gluedAfter.exec(html);

  if (after !== null) {
    throw new Error(`${route} has a link with no space after it: ${after[0]}`);
  }
}
