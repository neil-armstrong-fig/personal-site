import type {ViteUserConfig} from "vitest/config";

/**
 * Defaults every package's vitest config merges over. Keep it free of environment-specific
 * settings — those belong in the package that needs them.
 */
export const vitestBaseConfig: ViteUserConfig = {
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    restoreMocks: true,
    clearMocks: true,
    passWithNoTests: true,
  },
};
