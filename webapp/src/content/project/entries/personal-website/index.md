---
title: "Personal website"
cardTitle: "This"
sortOrder: 3
summary: "My own site: a software reference and a home for my long cycling trips, built AI native and open source."
datePublished: 2026-10-01
technologies:
  ["Astro", "TypeScript", "Tailwind CSS", "Leaflet", "Vitest", "Cloudflare Workers", "Cloudflare R2", "GitHub Pages"]
repositoryUrl: "https://github.com/neil-armstrong-fig/personal-site"
liveUrl: "https://neilarmstrong.dev/"
liveLabel: "Visit the site"
heroImage: "./_assets/personal-website-homepage.png"
heroBordered: true
heroAlt: "The neilarmstrong.dev homepage: a navigation bar with Home, Software, Cycling, About, and Contact, a headline introducing Neil Armstrong as a software architect in Belfast, two buttons, and a portrait of a bearded man in glasses."
featured: false
draft: false
seoTitle: "Personal website case study: Astro, Cloudflare and SEO | Neil Armstrong"
seoDescription: "How Neil Armstrong built his personal website: a static Astro site with Strava-driven ride maps, a Cloudflare Worker contact form, R2 video storage, and a focus on SEO and AI indexing."
---

## Two reasons to build it

This is my own website, and it has two jobs. The first is to be a reference for me as a software engineer, showing my experience and what I can do. The second is to show the other side of me, an avid cyclist. The cycling section holds my long solo trips, written up more personally and much more freeform than anything in the software pages.

## Static, but not only static

The site is static Astro, built once and served from GitHub Pages. It still does more than a pile of pages. Each trip pulls its figures from Strava at build time and shows them in metric and imperial. The ride maps are Leaflet and OpenStreetMap, and they only load when you open a ride log and scroll to the map. Without JavaScript you still get every ride name, distance and photograph.

## The principles from my other projects

It takes the principles from my other projects, [Janggi](/software/janggi/) most of all. Strict TypeScript. Lint that fails the build if a file imports something it shouldn't. Files that live next to the one thing that uses them. I left out acceptance-test-driven development. For a website it would be overkill.

Testing is Vitest for the logic that is worth testing on its own, like unit conversion, sorting, URL building and structured data. After the build, a validation step checks the generated pages for broken links, duplicate titles and missing SEO basics. I also use AI tools to check design claims directly in the browser, such as whether a page really fits a phone.

## AI native, in my own voice

I wanted to iterate quickly without the site sliding into a voice that isn't mine. So the repository is built for AI coding agents. `AGENTS.md` files describe the structure, the styling and the tone, including a list of phrases that make writing sound machine-made.

Adding content works like this. I paste in a rough first-person draft. The agent checks it against the evidence, such as my Strava data or the code, and asks me questions. Then it writes two versions and I pick one. The result keeps my sentences, my jokes and a consistent style, and a new page or feature is quick to add. I review and commit everything. This case study went through the same process.

## Cloudflare for what GitHub can't do

Trip videos were the problem. With them in the repository it grew to around 850MB, close to the 1GB GitHub repository limit. The first git push took a long time as a result. That wasn't sustainable. The clips now live in a Cloudflare R2 bucket and play from `media.neilarmstrong.dev`, meaning the repository is now about 100MB. `pnpm dev` plays local copies so I can still iterate and review new posts quickly, and the production build checks that every clip exists on the media origin as a gated check.

The contact form runs on a Cloudflare Worker, so my email address never appears on the page or in the repository. It's a Worker secret. The Worker checks a Turnstile token, a hidden honeypot field and field length limits before it sends anything through Email Routing. Those checks are essential for a form on the open web. The Worker deploys by itself, but only when its own source changes.

## Open source means easy hosting

I used the same simple approach as Janggi. Cloudflare holds the domain and GitHub Pages hosts the site. Every pull request runs the full build. A push to `main` also deploys and then tells IndexNow, so search engines hear about new pages quickly.

## Findable by people and by AI

I put a lot of effort into SEO and AI indexing. Pages carry structured data for me, for the FAQ, for each project and for breadcrumbs. `llms.txt` and the sitemaps are generated from the content, so they can't drift from it. Lighthouse runs against the built site and the targets are 95 for SEO, accessibility and best practices, and 90 for performance.

I'm fighting an uphill battle, because my name is Neil Armstrong. Still, searching for "Neil Armstrong Belfast" already puts this site first or second, alongside my LinkedIn profile. Though that is currently from my own manual searches, so treat it as an observation for now rather than a strict measurement!

## Open source, with some rights kept

I like building in the open, so the code is on GitHub under the MIT licence. My writing and photography aren't covered by that licence. I keep the copyright on those, and `CONTENT-LICENSE.md` says so. You're welcome to learn from the code, just please don't reuse my trips or my photos without reaching out first!

If you want to see where the cycling side goes, start with my personal favourite trip: [Tokyo to Seoul](/cycling/tokyo-to-seoul/). For the engineering side of how I run a team through a messy migration, there's [a platform modernisation](/software/platform-modernisation-back-on-track/).
