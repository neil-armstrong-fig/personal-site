// Matches "PREFIX Day N", "PREFIX: Day N" and "PREFIX-N", each optionally followed by ": title".
export function numberedDayPattern(prefixes: string): RegExp {
  return new RegExp(`^(?:${prefixes})(?:[: ]+Day\\s*|-)[1-9]\\d*(?::\\s*(?<title>.+))?$`, "i");
}
