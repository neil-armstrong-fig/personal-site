import {expect, it} from "vitest";

import {activeSectionId} from "./ActiveSection";

const sections = [
  {id: "work", top: -900},
  {id: "blog", top: -100},
  {id: "about", top: 600},
];

it("picks the section nearest above the activation line", () => {
  expect(activeSectionId(sections, 200)).toBe("blog");
});

it("picks a section exactly on the activation line", () => {
  expect(activeSectionId([{id: "work", top: 200}], 200)).toBe("work");
});

it("picks nothing while the first section is still below the line", () => {
  expect(activeSectionId([{id: "work", top: 300}], 200)).toBeUndefined();
});

it("picks nothing when there are no sections", () => {
  expect(activeSectionId([], 200)).toBeUndefined();
});

it("does not depend on the order the sections are given in", () => {
  const nearestFirst = [
    {id: "work", top: -50},
    {id: "blog", top: 100},
  ];
  const nearestLast = [...nearestFirst].reverse();

  expect(activeSectionId(nearestFirst, 200)).toBe("blog");
  expect(activeSectionId(nearestLast, 200)).toBe("blog");
});
