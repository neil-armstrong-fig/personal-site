---
title: "TQCC"
sortOrder: 2
summary: "A fast, accessible site for a Belfast cycling club, with content that non-technical editors can maintain."
datePublished: 2026-02-15
dateModified: 2026-09-29
technologies: ["Astro", "Tailwind CSS", "TypeScript", "Markdown content collections", "Sveltia CMS", "GitHub Pages"]
repositoryUrl: "https://github.com/neil-armstrong-fig/TQCC"
liveUrl: "https://www.titanicquartercc.com/"
liveLabel: "Visit TQCC"
heroImage: "./_assets/tqcc-ride-schedule-page.png"
heroAlt: "The Titanic Quarter Cycling Club rides page, showing weekly Wednesday group rides with start times, distances, and pace levels."
featured: true
draft: false
seoTitle: "TQCC case study: a cycling club website | Neil Armstrong"
seoDescription: "How Neil Armstrong built the Titanic Quarter Cycling Club website with Astro, Markdown content collections, structured data, and a CMS for non-technical editors."
---

## A club website built around the first ride

TQCC is the website for Titanic Quarter Cycling Club in Belfast. It lists the weekly group rides at five pace levels, the annual events, the newsletters and how to join.

The purpose is simple: get somebody out on the road with the club as quickly and easily as possible. The site puts the ride levels, the practical requirements, the taster rides and the contact details into one clear journey.

## Five-year-old information was blocking new members

The old website wasn't being maintained and was massively out of date. Joining information existed, but nobody could tell what was still current. In the [12 February 2026 homepage capture](https://web.archive.org/web/20260212054940/https://www.titanicquartercc.com/) the newest news was from January 2021. The archived membership page still listed fees for 2020!

People couldn't work out how to join, or even whether the club still existed. It also barely showed up on Google when somebody searched for a Belfast cycling club.

## From problem to a credible first version in one weekend

I was a club member who spotted the problem and offered to rebuild the site. I decided what it needed to do, chose the architecture, designed it and set the editorial direction. Then I worked with the committee to check the club information and refine what members old and new needed.

I built a credible first version over one weekend. Coding agents helped me go faster, but I directed the work, checked the output and made the design and technical decisions.

That meant more than writing new pages. I redesigned the route from first visit to first club ride. I built a visual system around the club's yellow, black and Giro-inspired pink. I also picked the hosting, set up the domain, rebuilt the search and sharing metadata, and added privacy-conscious analytics and automated quality checks.

Hosting on GitHub Pages is free, **saving the club £62 a year**. The domain is now the only running cost.

## Clearer joining, current content, and lower costs

- A website the club can actually update and improve.
- Clear steps for joining: taster rides, insurance, Cycling Ireland licences, fees, the right ride group and how to prepare for a first ride.
- Current information on weekly rides, annual events and newsletters.
- A miles or kilometres setting for anyone who struggles with the conversion 😉.

### Search evidence after the relaunch

Search Console covers Google search performance. Google Analytics only measures visits from people who opt in:

- Comparing Search Console's first and latest 28-day periods (3–30 April and 31 August–27 September), impressions rose 35% from 1,249 to 1,682. Average position improved from 6.64 to 5.81. Clicks fell from 214 to 152, but four seasonal “Lap the Lough” searches account for 32 of that 62-click drop. So I treat this as wider visibility, not traffic growth.
- Over the same periods “Belfast cycling club” held steady at position 2.43 then 2.44. “Cycling clubs Belfast” improved from 1.67 to 1.20.
- From 28 March to 27 September Google Analytics measured 1,693 visits. Search engines brought 1,163 of them, or 69%.

The original homepage also had a recent-rides feed from Strava. When Strava withdrew the club-activities API in September 2026, I swapped it for the club’s member count and a clear link to Strava. Better than pretending the old feature still worked.

## Keeping publishing simple and dependable

- **Content as structured Markdown.** Events, rides, pace groups and newsletters are content collections with typed schemas. Malformed content fails the build instead of reaching the site.
- **Astro and static GitHub Pages output.** The site is built ahead of time and deployed by GitHub Actions. Recent deployments take about a minute, and there is no application server to host or secure.
- **Build-time API access.** Strava club data is fetched during the build with credentials held as GitHub secrets. Those keys never reach a visitor’s browser.
- **Optional editing UI.** Sveltia CMS gives non-technical editors a visual way into the Markdown, and the repository stays the source of truth.
- **Automated checks.** Type checking and production builds run before every deployment. Lighthouse audits performance, accessibility, best practices and SEO separately.
- **Search and sharing.** Reusable metadata, organisation and event structured data, careful sitemap exclusions and IndexNow submissions help search engines find and understand new pages.
- **Coding agents with human review.** An agent can draft a small change in seconds. Review and the one-minute checked deployment are still separate steps.

## From search result to a suitable first ride

Success was never just explaining that TQCC exists. It was getting somebody out on the road with us. I think the rebuild does that. Someone can now go from a general search for a Belfast cycling club to the ride levels, kit, insurance, licence and contact details they need to turn up for a suitable first ride.

The club can keep that journey current without paying for hosting or waiting on a developer for every edit. Committee feedback links the clearer site with more interest from prospective members. The analytics can't say how many became members, or separate the website from everything else the club was doing, but it does show people finding TQCC through the searches the rebuild was designed for.
