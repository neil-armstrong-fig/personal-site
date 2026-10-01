import {expect, it} from "vitest";

import {selectHomepageCaseStudies} from "./SelectHomepageCaseStudies";

it("selects homepage case studies in their explicit order without changing the input", () => {
  const caseStudies = [
    {id: "latest", data: {}},
    {id: "transformation", data: {homepageOrder: 3}},
    {id: "new-platform", data: {homepageOrder: 2}},
    {id: "new-product", data: {homepageOrder: 1}},
  ];

  expect(selectHomepageCaseStudies(caseStudies).map(caseStudy => caseStudy.id)).toEqual([
    "new-product",
    "new-platform",
    "transformation",
  ]);
  expect(caseStudies.map(caseStudy => caseStudy.id)).toEqual([
    "latest",
    "transformation",
    "new-platform",
    "new-product",
  ]);
});
