import {expect, it} from "vitest";

import {nextThemePreference, parseThemePreference, themeAttribute, themePreferenceLabel} from "./ThemePreference";

it("cycles system, light, dark and back to system", () => {
  expect(nextThemePreference("system")).toBe("light");
  expect(nextThemePreference("light")).toBe("dark");
  expect(nextThemePreference("dark")).toBe("system");
});

it("accepts only a stored light or dark choice, and treats anything else as following the system", () => {
  expect(parseThemePreference("light")).toBe("light");
  expect(parseThemePreference("dark")).toBe("dark");
  expect(parseThemePreference("system")).toBe("system");
  expect(parseThemePreference("sepia")).toBe("system");
  expect(parseThemePreference(null)).toBe("system");
});

it("sets the theme attribute only for an explicit choice", () => {
  expect(themeAttribute("light")).toBe("light");
  expect(themeAttribute("dark")).toBe("dark");
  expect(themeAttribute("system")).toBeUndefined();
});

it("labels each preference for the toggle", () => {
  expect(themePreferenceLabel("system")).toBe("System Colours");
  expect(themePreferenceLabel("light")).toBe("Light");
  expect(themePreferenceLabel("dark")).toBe("Dark");
});
