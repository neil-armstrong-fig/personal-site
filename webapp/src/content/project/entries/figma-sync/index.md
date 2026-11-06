---
title: "Figma Sync"
sortOrder: 4
summary: "A tool I built to pull design tokens from the Figma API, so engineers use the same names as the designers. How it worked, how Code Connect compares, and what has changed since."
datePublished: 2026-11-06
technologies: ["TypeScript", "Figma REST API", "Style Dictionary", "SCSS", "Tailwind CSS", "Jest"]
repositoryUrl: "https://github.com/neil-armstrong-fig/figma-sync"
heroImage: "./_assets/figma-styles-to-code.png"
heroImageMobile: "./_assets/figma-styles-to-code-mobile.png"
heroImageDark: "./_assets/figma-styles-to-code-dark.png"
heroImageMobileDark: "./_assets/figma-styles-to-code-mobile-dark.png"
heroAlt: "Figma Sync collects colour and typography styles and preserves their names in generated SCSS helpers. The full code example uses typography, colour, opacity, and spacing helpers. Tailwind, Android, and iOS are alternative outputs."
heroBordered: true
featured: false
draft: false
seoTitle: "Figma Sync case study: design tokens pulled from Figma | Neil Armstrong"
seoDescription: "How Figma Sync pulled design tokens from the Figma API into SCSS, Tailwind, Android and iOS, how it compares with Code Connect, and why Figma's rate limits changed the picture."
---

**This is talking about a previous open source project that I built, though out of date now. I'm still proud of it even though, because it solved a real problem at the time.**

A common problem that cross-functional teams of engineers and product designers face is how do you keep both the Design System and the code in sync. One approach is [Code Systems](/blog/code-system/), but to facilitate this you need great tooling.

## Keeping tokens in sync

A number of years ago I was struggling to keep on top of design tokens in applications I was building. Designers would freely change the colours, typography, spacers etc, as they should fully be allowed and enabled to do. However, this meant that we, as the engineering side of the team, would have to manually go and find these tokens, update them in our codebase, and ensure they all worked.

This was unfortunately time consuming.

I wanted a way to automate this process, while also offering some nice helpers that abstract away the “code” side of it, but instead speak the designers' language as it is represented in Figma.

## Syncing directly from Figma

This is where the idea of [Figma Sync](https://github.com/neil-armstrong-fig/figma-sync) came from. The idea is to use the Figma API to directly extract all the design tokens dynamically, and then wrap it in nice helpers to ensure that when an engineer uses the token it is using the same language as the designer expects.

This would mean grabbing the tokens in a flow that made them look like `Primary/Text/200` etc, rather than a more code specific primary-text-200 etc. A small change, but massively boosts communication in a cross functional team when everyone speaks the same language.

Here is roughly what that looks like in a stylesheet, using the SCSS helpers Figma Sync generates. The names are the designer's own:

```scss
@use "generated/scss/ColorHelpers";
@use "generated/scss/TypographyHelpers";
@use "generated/scss/SpacerHelpers";

.button {
  @include TypographyHelpers.useFont("Text/M/Regular");
  color: ColorHelpers.useColor("Primary/Light/60");
  background: ColorHelpers.useColor("Primary/Dark/20", 0.5);
  padding: SpacerHelpers.useSpacer(2) SpacerHelpers.useSpacer(4);
}
```

The helpers fail loudly too. If a designer renames a style and the sync runs, a name that no longer exists stops the build and lists the valid ones, so a stale token can't slip through.

## Why not use the existing tools?

Tools existed already, mostly plugins within Figma itself. These, for the most part, work well. However the main limit is that you cannot automate it. It required an engineer loading up Figma, with a full designer seat, and exporting the tokens. Alternatively if no engineers had a designer seat (common) then they have to request a designer do the export and send it over. This is a surprisingly large overhead.

Figma Sync instead was a “pull” model rather than a “push” model like a typical plugin. It pulled from the Figma API: downloading the document locally in code, walking the document’s tree to find any design tokens used throughout the entire project dynamically (as design tokens could be defined in another Figma file entirely), and build out the tokens in the target language of choice (Tailwind, SCSS, Android and iOS).

At the time, this meant that any engineer could run it without a paid Figma seat. It can be automated on GitHub Actions to run on a schedule and create PRs automatically. It could easily scrape all the tokens from the entire document rather than expecting a fixed format. Checking every node meant no tokens were missed, instead of the blunt approach of only looking at a specific design token page, which might not exist in the target Figma file. Super flexible and super easy to use - a great example of excellent [Developer Experience](https://queue.acm.org/detail.cfm?id=3595878).

## A relic of the past?

Partly. [Code Connect](https://github.com/figma/code-connect) is the closest thing Figma has built, so it's the obvious comparison. It solves a different problem.

Code Connect links a component in Figma to the real component in your code, so Dev Mode shows your own snippets instead of generated ones. That's the other half of a [code system](/blog/code-system/). What it doesn't do is anything with tokens. Nothing in it generates or syncs colours, typography, or spacing. It also needs an Organization or Enterprise plan and a full Dev or Design seat, so the seat problem comes straight back.

Two other things have moved on since I built Figma Sync initially and last used it "in anger".

Tokens now live in Figma variables, and Figma Sync only reads styles. The variables REST API needs a full seat on an Enterprise plan, so I'd keep the styles route as a fallback for everyone else. Figma's MCP server can read the variables used in a selection. That helps an agent, but it won't crawl a whole document.

The rate limits changed too. A quick check of the latest Figma API shows that since November 2025 a view or collab seat gets 20 file requests a month. A full seat gets between 10 and 20 a minute on most plans. Figma Sync walks the file page by page and frame by frame, so one run makes a lot of requests. When Figma pushes back it just retries every second, and it doesn't wait for as long as Figma asks it to.

So Figma Sync was great back when the limits were more generous, back in yester-year. Now the throttling is so extreme that this approach is sadly not possible without loads of delays. My claim that any engineer could run it without a paid seat doesn't hold any more. I haven't re-run it against the new limits yet, so that comes from reading the code and the numbers.

## A future perhaps

Still, it's something I might consider updating. I can see the value even with the throttling as extreme as it is now, and there's scope for a less blunt approach to perhaps massively reduce the strain on the API. Fetching only the styles and variables I need, rather than whole pages, and backing off properly when Figma asks would be a start. I'd also add variables, with a styles fallback. Code Connect would handle the components and Figma Sync the tokens. Just need to get a project with a designer again to give me a reason to revisit it :)
