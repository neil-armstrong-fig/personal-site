import {getCollection} from "astro:content";
import type {CollectionEntry} from "astro:content";

import {isPublished} from "@src/content/shared/IsPublished";
import {sortNewestFirst} from "@src/content/shared/SortNewestFirst";

export async function getPublishedProjects(): Promise<CollectionEntry<"projects">[]> {
  return sortNewestFirst((await getCollection("projects")).filter(isPublished), project => project.data.datePublished);
}
