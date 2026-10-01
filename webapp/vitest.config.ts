import {resolve} from "node:path";

import {defineConfig, mergeConfig} from "vitest/config";

import {vitestBaseConfig} from "@personal-site/shared/config/vitest.base.ts";

export default mergeConfig(
  vitestBaseConfig,
  defineConfig({
    resolve: {
      alias: {
        "@src": resolve(import.meta.dirname, "src"),
      },
    },
  }),
);
