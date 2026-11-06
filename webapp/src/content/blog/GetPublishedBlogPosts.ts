import {getCollection} from "astro:content";
import type {CollectionEntry} from "astro:content";

import {isPublished} from "@src/content/shared/IsPublished";
import {sortNewestFirst} from "@src/content/shared/SortNewestFirst";

export async function getPublishedBlogPosts(): Promise<CollectionEntry<"blogPosts">[]> {
  return sortNewestFirst((await getCollection("blogPosts")).filter(isPublished), post => post.data.datePublished);
}
