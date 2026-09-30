import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig, globalIgnores} from "eslint/config";

const parentImportRestriction = {
  group: ["../*", "../**"],
  message: "Import through the '@src/*' alias rather than a parent-relative path.",
};

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
  globalIgnores([".astro/**", "coverage/**", "dist/**", "node_modules/**"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
    rules: {
      eqeqeq: ["error", "smart"],
      "no-console": ["warn", {allow: ["warn", "error"]}],
      "no-multiple-empty-lines": ["error", {max: 1}],
    },
  },
  {
    files: ["**/*.{ts,astro}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": ["error", {allowExpressions: true}],
      "@typescript-eslint/explicit-module-boundary-types": ["error", {allowArgumentsExplicitlyTypedAsAny: true}],
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-unused-vars": ["error", {argsIgnorePattern: "^_", varsIgnorePattern: "^_"}],
    },
  },
  {
    files: ["src/**/*.{ts,astro}"],
    rules: {
      "no-restricted-imports": restrictedImports(),
    },
  },
  {
    files: ["src/content.config.ts", "src/content/**/*.{ts,astro}"],
    rules: {
      "no-restricted-imports": restrictedImports(contentImportRestriction),
    },
  },
  {
    files: ["src/site/**/*.{ts,astro}"],
    rules: {
      "no-restricted-imports": restrictedImports(siteImportRestriction),
    },
  },
  {
    files: ["src/components/**/*.{ts,astro}"],
    rules: {
      "no-restricted-imports": restrictedImports(componentImportRestriction),
    },
  },
  {
    files: ["src/layouts/**/*.{ts,astro}"],
    rules: {
      "no-restricted-imports": restrictedImports(layoutImportRestriction),
    },
  },
  {
    files: ["src/scripts/**/*.ts"],
    rules: {
      "no-restricted-imports": restrictedImports(scriptImportRestriction),
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
  prettierConfig,
  {rules: {curly: ["error", "multi-line"]}},
);

function restrictedImports(...additionalRestrictions) {
  return ["error", {patterns: [parentImportRestriction, ...additionalRestrictions]}];
}
