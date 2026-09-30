import {getCollection} from "astro:content";
import type {CollectionEntry} from "astro:content";

import {isPublished} from "@src/content/shared/IsPublished";
import {parseTripChapterId} from "@src/content/trip/trip-chapter/ParseTripChapterId";

export async function getPublishedTripChapters(tripSlug: string): Promise<CollectionEntry<"tripChapters">[]> {
  const chapters = (await getCollection("tripChapters"))
    .filter(isPublished)
    .filter(chapter => parseTripChapterId(chapter.id).tripSlug === tripSlug);

  return chapters.sort((first, second) => first.data.order - second.data.order);
}
