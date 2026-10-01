import {getCollection} from "astro:content";
import type {CollectionEntry} from "astro:content";

import {sortProjects} from "@src/content/project/project-order/ProjectOrder";
import {isPublished} from "@src/content/shared/IsPublished";

export async function getPublishedProjects(): Promise<CollectionEntry<"projects">[]> {
  return sortProjects((await getCollection("projects")).filter(isPublished));
}
