import {expect, it} from "vitest";

import {isPlaceholderPage} from "./IsPlaceholderPage";

it("recognises a built placeholder page by its marker", () => {
  expect(isPlaceholderPage('<section class="relative" data-pending-page><h1>Coming soon</h1></section>')).toBe(true);
});

it("does not mistake a real page for a placeholder", () => {
  expect(isPlaceholderPage("<article><h1>A full end-to-end AI feature in three weeks</h1></article>")).toBe(false);
});
