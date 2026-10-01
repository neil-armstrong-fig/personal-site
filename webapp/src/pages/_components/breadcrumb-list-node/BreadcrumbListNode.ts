import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";
import type {JsonLdNode} from "@src/site/structured-data/types/JsonLdNode";

interface Breadcrumb {
  name: string;
  path: string;
}

export function buildBreadcrumbListNode(breadcrumbs: readonly Breadcrumb[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map(({name, path}, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}
