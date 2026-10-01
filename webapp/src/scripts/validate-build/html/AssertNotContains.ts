export function assertNotContains(html: string, unexpected: string, route: string): void {
  if (html.includes(unexpected)) {
    throw new Error(`${route} must not contain ${unexpected}.`);
  }
}
