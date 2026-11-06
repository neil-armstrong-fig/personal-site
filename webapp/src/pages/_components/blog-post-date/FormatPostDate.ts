export function formatPostDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {day: "numeric", month: "long", year: "numeric", timeZone: "UTC"});
}
