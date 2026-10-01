import * as astroPlugin from "prettier-plugin-astro";

import base from "@personal-site/shared/config/prettier.base.js";

/** @type {import("prettier").Config} */
export default {
  ...base,
  // The plugin is imported rather than named so it resolves from this package even when Prettier runs from the root.
  plugins: [astroPlugin],
  overrides: [
    {
      files: "*.astro",
      options: {parser: "astro"},
    },
  ],
};
