const day = new Intl.DateTimeFormat("en-GB", {day: "numeric", timeZone: "UTC"});
const dayMonth = new Intl.DateTimeFormat("en-GB", {day: "numeric", month: "long", timeZone: "UTC"});
const fullDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatTripDateRange(startDate: Date, endDate?: Date): string {
  if (endDate === undefined || startDate.getTime() === endDate.getTime()) {
    return fullDate.format(startDate);
  }

  if (startDate.getUTCFullYear() !== endDate.getUTCFullYear()) {
    return `${fullDate.format(startDate)}–${fullDate.format(endDate)}`;
  }

  if (startDate.getUTCMonth() !== endDate.getUTCMonth()) {
    return `${dayMonth.format(startDate)}–${fullDate.format(endDate)}`;
  }

  return `${day.format(startDate)}–${fullDate.format(endDate)}`;
}
