---
title: "Replacing a legacy document builder"
summary: "Replacing an end-of-life, plug-in-based editor for legal loan documents in a single summer, with a contract at stake."
careerPeriod: "2025"
role: "Hands-on individual contributor"
team: "2 from my company, 1 line-managed, alongside the client's editor team of about ten across multiple teams"
sortOrder: 2
technologies:
  - React
  - TypeScript
  - XML parsing
  - Document editing
  - Performance tuning
  - Legacy modernisation
draft: false
seoTitle: "Replacing a legacy document builder | Software case study"
seoDescription: "How I helped replace an end-of-life legal-document editor with a React and TypeScript rebuild in the summer of 2025, focusing on XML parsing and editor performance."
---

## An end-of-life editor, and a contract at risk

This engagement was for a US financial services company whose document builder was well past end of life. It ran on a browser plug-in framework with no security updates in a long time. Thousands of people used it to draft, edit and finalise legal loan documents.

That caused two problems. Few people knew how to develop for the framework, so the product was hard to change. And with no security updates it couldn't pass the audits and ISO certification the company's clients needed. It was part of a suite under a huge multi-year contract that was already signed. If those clients couldn't use it they risked losing their certification, and the company faced a large financial fallout.

## Why we were brought in

The client was rebuilding the product in React and TypeScript, and the team had made great progress before we joined. But it was an extremely complex space and the deadline was a few short months away, in the summer of 2025.

The document format was completely bespoke XML. A separate template editor created the template data. The document editor then added the specifics: numbered entry points and "bookmarks" where a user could add text. A finished document had to look and feel like its template but still allow overrides. The format was built for the old editor, so it carried metadata that needed changing and plenty of data nobody needed any more. The editor also had to parse changes back into the format constantly so auto-save could persist them.

There was a performance requirement as well: the new editor had to work in real time, at the same speed as the old one or better.

## Where I fit in

There were two of us from our side, split across the client's template and editor teams. I was on the editor team, the more visible and critical of the two, with a client team of about ten across engineering, product and design.

Neither of us knew the domain as well as the client's engineers. So we focused where our experience would help most: parsing and performance. We also skilled up their engineers along the way, through pairing, sessions and documentation.

I worked US hours from Belfast, roughly midday to 8pm, which gave us the most overlap to pair, mentor and upskill. I line-managed my colleague, and I was skilling up the client's unofficial tech lead at the same time. The approach to performance, refactoring and testing improvements was mine to decide, working with the client's engineering manager and that tech lead.

## Performance

Before we joined, the browser would literally freeze on big files or fast scrolls. Loading a large document could crash the software. Scrolling and editing both lagged.

The editing was built on a commercial word-processor-style editor component, and much of the work was deep dives into its quirks and limits. Many of the checks the library ran weren't needed for this kind of editing. So I added overrides that replaced a library function with a new one. The new function adds its own checks or skips them, and calls the original where it still needs to. Each override was well documented in the code and easy to switch on and off, so any change could be compared with and without it.

By the end, scrolling and navigation were as smooth as you would find in Google Docs on Drive.

## Templates and updating the library

The template model had its own problem. "Template breakouts" let users edit template text when they were only meant to inject text into specific areas. I spent a huge amount of time hunting these down. That meant diving into what the library and our custom code were each doing, then applying surgical fixes.

Updating the library was hard for two reasons. Regulation made recent versions difficult to adopt, and updates needed approval meetings. Even minor versions could break things, because of hacks introduced before we joined that nobody fully understood. Understanding those hacks was part of the job.

## Proving it

The pilot groups were long-time users of the old editor. They tested the new one extensively and were extremely picky and brutal with their feedback. We fixed all of their concerns in time.

We did not use acceptance tests on this engagement, because of the rush.

## Outcome

We delivered the required spec just in time. What shipped was an MVP. Some features were agreed cuts, and the client's team carried on without us to deliver them. But scope moved a fair amount in the weeks before release, as some of the cuts turned out to be absolutely required.

Performance is the part I'm proudest of. And we didn't just leave a codebase behind. We left the team in a much better spot, with better testing, better standards and a better understanding of the library, ready to keep going.

The client's team released the MVP and carried on with post-MVP work. They were pleased enough to extend the contract by a month and asked for us back more than once, but we were already committed to another client.
