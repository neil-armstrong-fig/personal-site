import {expect, it} from "vitest";

import {buildBreadcrumbListNode} from "./BreadcrumbListNode";

it("numbers breadcrumb items from one with absolute URLs", () => {
  expect(
    buildBreadcrumbListNode([
      {name: "Software", path: "/software/"},
      {name: "Janggi", path: "/software/janggi/"},
    ]),
  ).toEqual({
    "@type": "BreadcrumbList",
    itemListElement: [
      {"@type": "ListItem", position: 1, name: "Software", item: "https://neilarmstrong.dev/software/"},
      {"@type": "ListItem", position: 2, name: "Janggi", item: "https://neilarmstrong.dev/software/janggi/"},
    ],
  });
});
