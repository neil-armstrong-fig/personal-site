import astro from "eslint-plugin-astro";
import globals from "globals";
import {defineConfig} from "eslint/config";

import {baseConfig, restrictedImports} from "@personal-site/shared/config/eslint.base.js";

// The site may import itself and `@personal-site/shared`, never the contact Worker.
const allowedPackages = ["@personal-site/shared"];

const contentImportRestriction = {
  group: [
    "@src/components",
    "@src/components/**",
    "@src/layouts",
    "@src/layouts/**",
    "@src/pages",
    "@src/pages/**",
    "@src/scripts",
    "@src/scripts/**",
    "@src/site",
    "@src/site/**",
  ],
  message: "Content code must not depend on rendering, site-output or command-line script code.",
};

const siteImportRestriction = {
  group: [
    "@src/components",
    "@src/components/**",
    "@src/layouts",
    "@src/layouts/**",
    "@src/pages",
    "@src/pages/**",
    "@src/scripts",
    "@src/scripts/**",
  ],
  message: "Site configuration and output builders must not depend on rendering or command-line script code.",
};

const componentImportRestriction = {
  group: ["@src/layouts", "@src/layouts/**", "@src/pages", "@src/pages/**", "@src/scripts", "@src/scripts/**"],
  message: "Shared components must not depend on layouts, routes or command-line scripts.",
};

const layoutImportRestriction = {
  group: ["@src/pages", "@src/pages/**", "@src/scripts", "@src/scripts/**"],
  message: "Shared layouts must not depend on routes or command-line scripts.",
};

const scriptImportRestriction = {
  group: ["@src/components", "@src/components/**", "@src/layouts", "@src/layouts/**", "@src/pages", "@src/pages/**"],
  message: "Command-line scripts must not depend on rendering code.",
};

export default defineConfig(
  {ignores: [".astro/**"]},
  ...baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages}),
  ...astro.configs["flat/recommended"],
  {
    files: ["src/content.config.ts", "src/content/**/*.{ts,astro}"],
    rules: {
      "no-restricted-imports": restricted(contentImportRestriction),
    },
  },
  {
    files: ["src/site/**/*.{ts,astro}"],
    rules: {
      "no-restricted-imports": restricted(siteImportRestriction),
    },
  },
  {
    files: ["src/components/**/*.{ts,astro}"],
    rules: {
      "no-restricted-imports": restricted(componentImportRestriction),
    },
  },
  {
    files: ["src/layouts/**/*.{ts,astro}"],
    rules: {
      "no-restricted-imports": restricted(layoutImportRestriction),
    },
  },
  {
    files: ["src/scripts/**/*.ts"],
    rules: {
      "no-restricted-imports": restricted(scriptImportRestriction),
    },
  },
  {
    files: ["src/**/*.astro"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
);

function restricted(layerRestriction) {
  return restrictedImports({allowedPackages, patterns: [layerRestriction]});
}
