interface TripChapterId {
  tripSlug: string;
  chapterSlug: string;
}

const CHAPTER_ID_PATTERN = /^(?<tripSlug>[^/]+)\/part-\d+-(?<chapterSlug>.+)$/;

export function parseTripChapterId(id: string): TripChapterId {
  const groups = CHAPTER_ID_PATTERN.exec(id)?.groups;
  const tripSlug = groups?.["tripSlug"];
  const chapterSlug = groups?.["chapterSlug"];

  if (tripSlug === undefined || chapterSlug === undefined) {
    throw new Error(`${id}: trip chapter ids must match "<trip-slug>/part-<order>-<chapter-slug>".`);
  }

  return {tripSlug, chapterSlug};
}
