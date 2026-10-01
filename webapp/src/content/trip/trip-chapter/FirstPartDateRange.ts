const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface TripDateRange {
  startDate: Date;
  endDate?: Date;
}

interface ChapterStart {
  startDate: Date;
}

// The trip's own frontmatter dates span the whole trip, so the part before the first real chapter (the
// prologue that stays on the overview page) has no date range of its own; this derives one, ending the day
// before the first chapter begins.
export function firstPartDateRange(trip: TripDateRange, chapters: readonly ChapterStart[]): TripDateRange {
  const firstChapter = chapters[0];

  if (firstChapter === undefined) {
    return trip;
  }

  return {
    startDate: trip.startDate,
    endDate: new Date(firstChapter.startDate.getTime() - MS_PER_DAY),
  };
}
