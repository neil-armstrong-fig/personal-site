import {expect, it} from "vitest";

import {shuffled} from "./RandomOrder";

it("returns every item exactly once without changing the input", () => {
  const items = [1, 2, 3, 4, 5];
  const result = shuffled(items, () => 0.3);

  expect([...result].sort()).toEqual(items);
  expect(items).toEqual([1, 2, 3, 4, 5]);
});

it("uses the random source to choose the order", () => {
  expect(shuffled(["a", "b", "c"], () => 0)).toEqual(["b", "c", "a"]);
  expect(shuffled(["a", "b", "c"], () => 0.99)).toEqual(["a", "b", "c"]);
});
