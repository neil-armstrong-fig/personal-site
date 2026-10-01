interface DatedEntry {
  date: string;
}

interface TripChapterDateRange {
  startDate: Date;
  endDate?: Date;
}

export function filterByTripChapterDateRange<Entry extends DatedEntry>(
  entries: readonly Entry[],
  chapter: TripChapterDateRange,
): Entry[] {
  const startIso = isoDate(chapter.startDate);
  const endIso = isoDate(chapter.endDate ?? chapter.startDate);

  return entries.filter(entry => entry.date >= startIso && entry.date <= endIso);
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
