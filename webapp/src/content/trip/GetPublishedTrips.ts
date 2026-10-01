import {getCollection} from "astro:content";
import type {CollectionEntry} from "astro:content";

import {isPublished} from "@src/content/shared/IsPublished";
import {sortNewestFirst} from "@src/content/shared/SortNewestFirst";

export async function getPublishedTrips(): Promise<CollectionEntry<"trips">[]> {
  return sortNewestFirst((await getCollection("trips")).filter(isPublished), trip => trip.data.startDate);
}
