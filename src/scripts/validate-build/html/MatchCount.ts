export function matchCount(value: string, pattern: RegExp): number {
  return [...value.matchAll(pattern)].length;
}
