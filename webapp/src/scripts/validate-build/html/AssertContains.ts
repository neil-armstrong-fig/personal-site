export function assertContains(html: string, expected: string, route: string): void {
  if (!html.includes(expected)) {
    throw new Error(`${route} must contain ${expected}.`);
  }
}
