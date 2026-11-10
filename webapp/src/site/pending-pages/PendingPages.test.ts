import {expect, it} from "vitest";

import {isPendingSoftwarePath, pendingSoftwareSlugs, selectPlaceholderSlugs} from "./PendingPages";

it("has no case studies waiting for approval", () => {
  expect(pendingSoftwareSlugs()).toEqual([]);
});

it("generates no placeholder routes when there are no pending case studies", () => {
  expect(selectPlaceholderSlugs([])).toEqual([]);
  expect(selectPlaceholderSlugs(["janggi"])).toEqual([]);
});

it("drops the placeholder once the real page is published", () => {
  expect(selectPlaceholderSlugs(["janggi", "ai-native-delivery"])).toEqual([]);
});

it("allows the approved AI-delivery case study into the sitemap", () => {
  expect(isPendingSoftwarePath("/software/ai-native-delivery/")).toBe(false);
});

it("does not treat other paths as pending, including near misses", () => {
  expect(isPendingSoftwarePath("/software/janggi/")).toBe(false);
  expect(isPendingSoftwarePath("/software/ai-native-delivery/extra/")).toBe(false);
  expect(isPendingSoftwarePath("/blog/ai-native-delivery/")).toBe(false);
});
