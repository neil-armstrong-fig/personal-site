import {expect, it} from "vitest";

import {sortProfessionalCaseStudies} from "./ProfessionalCaseStudyOrder";

it("sorts professional case studies by their explicit reverse-chronological order", () => {
  const caseStudies = [
    {id: "oldest", data: {sortOrder: 3}},
    {id: "newest", data: {sortOrder: 1}},
    {id: "middle", data: {sortOrder: 2}},
  ];

  expect(sortProfessionalCaseStudies(caseStudies).map(caseStudy => caseStudy.id)).toEqual([
    "newest",
    "middle",
    "oldest",
  ]);
  expect(caseStudies.map(caseStudy => caseStudy.id)).toEqual(["oldest", "newest", "middle"]);
});
