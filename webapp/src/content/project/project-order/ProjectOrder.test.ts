import {expect, it} from "vitest";

import {sortProjects} from "./ProjectOrder";

it("sorts projects by their explicit order without changing the input", () => {
  const projects = [
    {id: "last", data: {sortOrder: 3}},
    {id: "first", data: {sortOrder: 1}},
    {id: "middle", data: {sortOrder: 2}},
  ];

  expect(sortProjects(projects).map(project => project.id)).toEqual(["first", "middle", "last"]);
  expect(projects.map(project => project.id)).toEqual(["last", "first", "middle"]);
});
