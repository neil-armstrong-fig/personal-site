import {baseConfig} from "@personal-site/shared/config/eslint.base.js";

// The Worker may import itself and `@personal-site/shared`, never the Astro site.
export default baseConfig({tsconfigRootDir: import.meta.dirname, allowedPackages: ["@personal-site/shared"]});
