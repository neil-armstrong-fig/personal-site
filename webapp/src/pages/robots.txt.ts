import type {APIRoute} from "astro";

import {absoluteUrl} from "@src/site/urls/AbsoluteUrl";

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap-index.xml")}\nSitemap: ${absoluteUrl("/sitemap-images.xml")}\n`,
    {headers: {"Content-Type": "text/plain; charset=utf-8"}},
  );
