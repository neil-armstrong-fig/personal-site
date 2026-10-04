---
title: "Getting a platform modernisation back on track"
summary: "Recovering two struggling teams on a time-critical PHP modernisation, with a walkable rough frontend and a proxy between the old API and the new services."
careerPeriod: "2024–2025"
role: "Lead engineer"
team: "Two teams in turn: leading a frontend of 3 engineers, then a backend of 4 engineers, all line-managed"
sortOrder: 3
technologies:
  - React
  - Next.js
  - SST
  - AWS Lambda
  - Incremental migration
draft: false
seoDescription: "An anonymised case study about recovering two struggling teams on a time-critical PHP platform modernisation, using a rough end-to-end frontend and a proxy layer."
---

## Two struggling teams, one deadline

I joined a full rewrite of a legacy PHP application at a UK deals business part of the way through in November 2024, and took on two teams in turn. The first was the frontend team building the signup and renewal journey. It was judged unlikely to make its delivery date. Under my leadership we delivered the whole journey by the year-end deadline, in December 2024, about two months after I joined. The second was a backend team that had already missed its own deadline. I cleared its half-finished work, fixed its delivery pipeline and built a proxy layer. The new services could go live while the old API handled everything that wasn't ready. The client asked its board and investors for an extension, and I had to recover the backend in the new year. That release shipped at the end of March 2025.

## Coming in part-way

It was a massive undertaking, with a large number of teams modernising a legacy PHP application. Over 10 contractors worked alongside a handful of client engineers, so every week of delay was expensive. The client's board expected the full piece by the end of the year. The project had already been running for most of the year when I was brought in.

My first job was to help a struggling frontend team of three engineers, one product person and one designer. Our piece was the signup journey, the first thing a new or renewing member would see. Signups were critical to the client's revenue, so mistakes here would cost them dearly.

## Fewer ceremonies, a clearer plan

The team didn't know how to keep moving forward and had no clear plan. In my opinion they were also wasting time on Agile ceremonies that weren't providing value. I love Agile ceremonies when they earn their place, but the first thing I did was cut them right down. Retrospectives and refinement went. When people know what they're doing and talk to each other constantly, those sessions can be a waste of time.

In their place I set a clear pipeline of deliverables, described as high-level ideas rather than low-level features. I pushed hard for tight communication so work moved quickly instead of abstractly. That meant nearly hourly contact with product, design and engineering.

## The "fuzzy frontend"

The plan was to build the full end-to-end journey first as a "fuzzy frontend": developer-art screens that let anyone walk through the whole flow. That let us quickly figure out and prove the logic and the steps.

- **Unstyled on purpose.** Plain boxes, inputs and dropdowns from the existing design system where we could. No accessibility or responsive design yet.
- **Faked choices.** Picking different employment details exercised the later screens and the different tracks a signup could take, including complex filtering logic to reveal the right one.
- **Proving eligibility.** Different employers had different requirements for proving employment, from various document types to an email confirmation.
- **Renewal from the start.** Renewal reused parts of signup but differed slightly, so each screen also appeared in the renewal flow as it was built.
- **Persona shortcuts.** Product and design could pick a persona from a test screen, opened with a hotkey, to skip ahead to the steps they cared about and "skip" the awkward bits.

You see the "fuzzy outline" first. As it's built out it comes into focus and becomes the real frontend. You don't need to build the whole thing to demo it, so you can show bits and pieces quickly. If one part needs more time or thought you don't down tools and wait. You move on to the next thing. That also gave the domain experts thinking time, so nobody was rushed or surprised.

## Divide and conquer

From the fuzzy frontend we could divide the work and take on the hardest areas without waiting for the other pieces. The other steps were faked or skipped until they were ready. The team moved extremely quickly and built high-quality implementation, and design and product were finally engaged directly on delivery. No more "waterfall" or "build it one step at a time". Just a fast-paced, engaged team.

Throughout, I worked out what we would deliver and how, ran demos, and delivered features myself in a surgical way where my expertise added most. Scope grew shortly after I joined: new verification methods, new employment selections, hidden dropdowns, and support for a second, related discount service with different branding and a slightly different flow. Unexpected and a big change, but the fuzzy frontend let us prototype it quickly and validate the differences. The journey was still delivered with every aspect covered. I enjoyed it. I felt part of the journey, and it still surprises me how much just getting people to talk to each other can achieve.

## The backend: clearing the decks

The second team was four engineers and me, and all four were my direct reports. I worked with the client's product owner and engineering manager, and held most of the control over architecture, approach and delivery: the direction, the timelines and milestones, the alternatives that could hit the deadline, and the scope cuts.

After that I took over another struggling team: the four-engineer team building the new backend services behind signup and the "my account" pages. It was stuck in the mud and a bit rudderless, and had missed the year-end deadline before I joined. This was at the start of the following year, on SST and AWS Lambda.

First I took stock of what was in progress. The team had been downsized from 7 to 4 engineers, which left about ten orphaned pull requests and a lot of half-done work. I asked the team to pause and swarm on those first. It took two weeks and served two purposes:

1. It closed out the open work quickly and deleted anything out of date, for a fresh start.
2. It was a knowledge-transfer session. I and others could ask questions, so we all shared an understanding of what needed doing.

## Fixing delivery

That exposed the friction in delivery. The pipeline was slow and broken, the infrastructure was overly complex and local deployments were manual and difficult. I did a large clean-up to take that burden off the team so they could focus on delivery.

As with the frontend, I created an extremely lightweight end-to-end flow in the code and divided up the pieces. I named "captains" for each service the backend provided: signup, renewal, "my account" and admin. I helped all of them extensively to unblock concerns and misunderstandings quickly, much like the frontend engaging with stakeholders.

## A proxy between the old and the new

It became clear that other parts of the product wouldn't be ready in time. To hit the extended deadline we built a proxy layer. Areas that could use the new way of working went to the new "V2" services and everything else went to the old API. Environment variables decided the routing, which also made it easy to A/B test per environment.

Moving everything off the old system needed a data migration, because the PHP database differed from the DynamoDB used in V2. I wasn't part of that migration as the contract ended first, but I laid the foundation for it. The backend had missed the year-end deadline and the client asked its board and investors for an extension. Recovering it in the new year fell to me, and the proxy shipped at the end of March 2025. Testing was a mix of unit and manual tests.

It was intense and needed a keen eye to stop the code turning into spaghetti. I believe we landed a really clean abstraction layer, so the team would be in a good place after we rolled off. I believe they did fully migrate, but I'm not certain. The client carried on building V2 and stripping back V1. A missed deadline put the board and investors in play, and we found a compromise that kept everyone reasonably happy while still delivering real value.
