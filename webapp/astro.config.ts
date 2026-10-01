import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import {defineConfig} from "astro/config";

import {tripFiguresIntegration} from "./src/content/trip/trip-figures/TripFiguresIntegration";

export default defineConfig({
  site: "https://neilarmstrong.dev",
  output: "static",
  image: {
    layout: "constrained",
    breakpoints: [480, 750, 1080, 1600],
    service: {entrypoint: "astro/assets/services/sharp", config: {webp: {quality: 70}}},
  },
  integrations: [tripFiguresIntegration(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
