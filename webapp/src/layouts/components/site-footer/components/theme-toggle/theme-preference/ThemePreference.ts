export const themePreferences = ["system", "light", "dark"] as const;

export type ThemePreference = (typeof themePreferences)[number];

export type ThemeAttribute = Exclude<ThemePreference, "system">;

export const THEME_STORAGE_KEY = "theme";

/** Anything other than a stored light or dark choice follows the system. */
export function parseThemePreference(stored: string | null): ThemePreference {
  return themePreferences.find(preference => preference === stored) ?? "system";
}

export function nextThemePreference(current: ThemePreference): ThemePreference {
  const index = themePreferences.indexOf(current);
  return themePreferences[(index + 1) % themePreferences.length] as ThemePreference;
}

/** The value for `data-theme` on the root element, or undefined to leave it off and follow the system. */
export function themeAttribute(preference: ThemePreference): ThemeAttribute | undefined {
  if (preference === "system") {
    return undefined;
  }

  return preference;
}

export function themePreferenceLabel(preference: ThemePreference): string {
  if (preference === "light") {
    return "Light";
  }

  if (preference === "dark") {
    return "Dark";
  }

  return "System Colours";
}
