export function sortNewestFirst<Entry>(entries: readonly Entry[], getDate: (entry: Entry) => Date): Entry[] {
  return [...entries].sort((first, second) => getDate(second).getTime() - getDate(first).getTime());
}
