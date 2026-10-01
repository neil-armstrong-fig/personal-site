import type {PageSummary} from "@src/scripts/validate-build/page-summary/types/PageSummary";

const uniquePageProperties = ["title", "description", "canonical"] as const;
type UniquePageProperty = (typeof uniquePageProperties)[number];

export function assertUniquePageProperties(pages: readonly PageSummary[]): void {
  for (const property of uniquePageProperties) {
    assertUnique(pages, property);
  }
}

function assertUnique(pages: readonly PageSummary[], property: UniquePageProperty): void {
  const seen = new Map<string, string>();

  for (const page of pages) {
    const value = page[property];

    if (value === "") {
      throw new Error(`${page.route} has no ${property}.`);
    }

    if (seen.has(value)) {
      throw new Error(`${page.route} and ${seen.get(value)} share the same ${property}: ${value}`);
    }

    seen.set(value, page.route);
  }
}
