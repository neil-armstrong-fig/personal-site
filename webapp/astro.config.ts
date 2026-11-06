import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import {defineConfig} from "astro/config";

import {tripFiguresIntegration} from "./src/content/trip/trip-figures/TripFiguresIntegration";
import {isPendingSoftwarePath} from "./src/site/pending-pages/PendingPages";
import {lastChangeOf} from "./src/site/sitemap/LastChangeOf";
import {sitemapSourcesOf} from "./src/site/sitemap/SitemapSources";
import {isUnlistedPath} from "./src/site/unlisted-pages/UnlistedPages";

export default defineConfig({
  site: "https://neilarmstrong.dev",
  output: "static",
  // The posts are listed on /software/, so the old index sends visitors there. GitHub Pages cannot send a 301: Astro
  // writes a page with a meta refresh and a canonical link to the target instead.
  redirects: {"/blog": "/software/#blog"},
  image: {
    layout: "constrained",
    breakpoints: [480, 750, 1080, 1600],
    service: {entrypoint: "astro/assets/services/sharp", config: {webp: {quality: 70}}},
  },
  integrations: [
    tripFiguresIntegration(),
    sitemap({
      // A placeholder for a page that does not exist yet, or a page meant to be shared as a link, is not something to
      // send a crawler to.
      filter: page => {
        const {pathname} = new URL(page);
        return !isPendingSoftwarePath(pathname) && !isUnlistedPath(pathname);
      },
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
