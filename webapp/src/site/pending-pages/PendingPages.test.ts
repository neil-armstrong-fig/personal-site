import {expect, it} from "vitest";

import {isPendingSoftwarePath, pendingSoftwareSlugs, selectPlaceholderSlugs} from "./PendingPages";

it("lists the AI-delivery case study while it waits for the client's approval", () => {
  expect(pendingSoftwareSlugs()).toEqual(["ai-native-delivery"]);
});

it("generates a placeholder route until a published entry carries the slug", () => {
  expect(selectPlaceholderSlugs([])).toEqual(["ai-native-delivery"]);
  expect(selectPlaceholderSlugs(["janggi"])).toEqual(["ai-native-delivery"]);
});

it("drops the placeholder once the real page is published", () => {
  expect(selectPlaceholderSlugs(["janggi", "ai-native-delivery"])).toEqual([]);
});

it("keeps the pending case study out of the sitemap", () => {
  expect(isPendingSoftwarePath("/software/ai-native-delivery/")).toBe(true);
});

it("does not treat other paths as pending, including near misses", () => {
  expect(isPendingSoftwarePath("/software/janggi/")).toBe(false);
  expect(isPendingSoftwarePath("/software/ai-native-delivery/extra/")).toBe(false);
  expect(isPendingSoftwarePath("/blog/ai-native-delivery/")).toBe(false);
});
