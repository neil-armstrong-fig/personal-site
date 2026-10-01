import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig} from "eslint/config";

export const ignores = ["**/dist/**", "**/coverage/**", "**/.wrangler/**"];

const workspaceScope = "@personal-site";

// Climbing out of a folder with `../` is refused. This is also what makes the workspace boundary below
// airtight: with `../` unavailable, the only way into another package is by its name, which the boundary
// pattern covers. Same-folder `./x` is fine.
const noParentImports = {
  group: ["../*", "../**"],
  message: "Import through the package's own name or a path alias rather than a parent-relative path.",
};

/**
 * Builds the `no-restricted-imports` rule, always including the workspace boundary.
 *
 * Flat config replaces a rule outright rather than merging it, so any override that needs extra
 * restrictions must be built here too: declaring `no-restricted-imports` directly in an override
 * silently drops the boundary for those files.
 *
 * @param allowedPackages workspace packages this code may import; everything else in the scope is
 *   denied, so a package added later is denied by default rather than quietly allowed.
 */
export function restrictedImports({allowedPackages = [], paths = [], patterns = []} = {}) {
  const permitted = allowedPackages.flatMap(name => [`!${name}`, `!${name}/**`]);

  const workspaceBoundary = {
    group: [`${workspaceScope}/*`, ...permitted],
    message:
      allowedPackages.length > 0
        ? `This package may only import ${allowedPackages.join(", ")} from the workspace.`
        : "This package may not import other workspace packages.",
  };

  return ["error", {paths, patterns: [noParentImports, workspaceBoundary, ...patterns]}];
}

/**
 * The rules every package in the workspace shares.
 *
 * @param tsconfigRootDir always `import.meta.dirname`: the directory of the calling `eslint.config.js`.
 *   The editor runs one ESLint server for the whole workspace, and without an explicit root the parser
 *   mixes up which package a file belongs to.
 * @param allowedPackages passed through to `restrictedImports`.
 */
export function baseConfig({tsconfigRootDir, allowedPackages = []} = {}) {
  if (typeof tsconfigRootDir !== "string") {
    throw new Error("baseConfig needs tsconfigRootDir: pass `import.meta.dirname` from your eslint.config.js.");
  }

  return defineConfig(
    {ignores},
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        parserOptions: {tsconfigRootDir},
        globals: {
          ...globals.es2022,
          ...globals.node,
        },
      },
      rules: {
        eqeqeq: ["error", "smart"],
        "no-multiple-empty-lines": ["error", {max: 1}],
        "no-console": ["warn", {allow: ["warn", "error"]}],
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/explicit-function-return-type": ["error", {allowExpressions: true}],
        "@typescript-eslint/explicit-module-boundary-types": ["error", {allowArgumentsExplicitlyTypedAsAny: true}],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-unused-vars": ["error", {argsIgnorePattern: "^_", varsIgnorePattern: "^_"}],
        "no-restricted-imports": restrictedImports({allowedPackages}),
      },
    },
    // Config files are plain modules rather than package source, so the TypeScript rules do not apply.
    {
      files: ["*.{js,mjs,ts}", "config/**/*.{js,mjs,ts}"],
      rules: {
        "no-restricted-imports": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
      },
    },
    prettierConfig,
    // After `prettierConfig`, which switches `curly` off. Prettier never adds or removes braces, so only
    // ESLint can require them around a body on a line of its own.
    {rules: {curly: ["error", "multi-line"]}},
  );
}
