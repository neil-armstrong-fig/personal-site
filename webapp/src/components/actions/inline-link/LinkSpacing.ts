export const linkSpacings = ["before", "around", "none"] as const;

export type LinkSpacing = (typeof linkSpacings)[number];
