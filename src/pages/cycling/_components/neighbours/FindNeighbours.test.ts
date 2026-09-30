import {expect, it} from "vitest";

import {findNeighbours} from "./FindNeighbours";

it("finds the neighbours of an entry in a list", () => {
  const entries = [{id: "a"}, {id: "b"}, {id: "c"}];

  expect(findNeighbours(entries, "b")).toEqual({previous: {id: "a"}, next: {id: "c"}});
  expect(findNeighbours(entries, "a")).toEqual({previous: undefined, next: {id: "b"}});
  expect(findNeighbours(entries, "c")).toEqual({previous: {id: "b"}, next: undefined});
});

it("returns no neighbours for an unknown entry", () => {
  expect(findNeighbours([{id: "a"}], "missing")).toEqual({previous: undefined, next: undefined});
});
