interface TripDateSummary {
  duration: string;
  months: string;
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const averageDaysPerMonth = 365.25 / 12;
const month = new Intl.DateTimeFormat("en-GB", {month: "long", timeZone: "UTC"});
const monthYear = new Intl.DateTimeFormat("en-GB", {month: "long", year: "numeric", timeZone: "UTC"});

export function formatTripDateSummary(startDate: Date, endDate?: Date): TripDateSummary {
  const finalDate = endDate ?? startDate;
  const days = Math.round((finalDate.getTime() - startDate.getTime()) / millisecondsPerDay) + 1;

  return {
    duration: formatDuration(days),
    months: formatMonths(startDate, finalDate),
  };
}

function formatDuration(days: number): string {
  if (days < 7) {
    return `${days} ${pluralise(days, "day")}`;
  }

  if (days < 42) {
    const weeks = Math.max(1, Math.round(days / 7));

    return `${weeks} ${pluralise(weeks, "week")}`;
  }

  const months = Math.max(1, Math.round(days / averageDaysPerMonth));

  return `${months} ${pluralise(months, "month")}`;
}

function pluralise(count: number, singular: string): string {
  if (count === 1) {
    return singular;
  }

  return `${singular}s`;
}

function formatMonths(startDate: Date, endDate: Date): string {
  if (startDate.getUTCFullYear() !== endDate.getUTCFullYear()) {
    return `${monthYear.format(startDate)}–${monthYear.format(endDate)}`;
  }

  if (startDate.getUTCMonth() !== endDate.getUTCMonth()) {
    return `${month.format(startDate)}–${monthYear.format(endDate)}`;
  }

  return monthYear.format(startDate);
}
