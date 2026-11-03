import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import {defineConfig} from "astro/config";

import {tripFiguresIntegration} from "./src/content/trip/trip-figures/TripFiguresIntegration";
import {lastChangeOf} from "./src/site/sitemap/LastChangeOf";
import {sitemapSourcesOf} from "./src/site/sitemap/SitemapSources";

export default defineConfig({
  site: "https://neilarmstrong.dev",
  output: "static",
  image: {
    layout: "constrained",
    breakpoints: [480, 750, 1080, 1600],
    service: {entrypoint: "astro/assets/services/sharp", config: {webp: {quality: 70}}},
  },
  integrations: [
    tripFiguresIntegration(),
    sitemap({
      // Each page says when it last changed, so a crawler can skip the ones that have not and return to those that have.
      serialize: item => {
        return {...item, lastmod: lastChangeOf(sitemapSourcesOf(new URL(item.url).pathname))};
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
