export function isPlaceholderPage(html: string): boolean {
  return html.includes("data-pending-page");
}
