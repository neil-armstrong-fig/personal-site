---
title: "Reinventing audio installation software"
summary: "Leading a ground-up rethink of professional-audio installation software, then carrying its core idea into a released companion tool that extended the team's contract."
careerPeriod: "2022–2024"
sortOrder: 4
homepageOrder: 1
technologies:
  - TypeScript
  - React
  - Electron
  - Playwright
  - Ionic
  - Acceptance testing
draft: false
seoDescription: "How I led a ground-up rethink of audio installation software, with acceptance-test-driven delivery, and reverse-engineered a file export that shipped."
---

## A ground-up rethink, and the part that shipped

For a global professional-audio manufacturer, I was engineering lead on a ground-up replacement for its legacy audio-system design software. The client's direction changed before it could ship. So we carried the core idea into a companion tool that generated files for the old software. That tool was released. We proved it could work within weeks, and that extended the whole team's contract by about 12 months.

## The problem

Professional audio has a bit of a modernisation problem. A lot of the big software products are extremely old and have the UX to match.

Our task was to completely rethink the model for audio system installation. A rethink from the ground up made it a true "product trio" project. Product, design and engineering worked super closely together to solve problems quickly, all with the end user in mind. I was engineering lead for five engineers. I worked with two client-side QA engineers, two product people (one client, one ours) and three designers, all reporting to one manager across the three disciplines. A separate three-engineer backend team worked in Elixir.

Audio installation is such a wide problem. You could be installing a system in a café or an entire sports stadium. A concert venue might have three or four input locations and two or three output zones. A stadium might have three or four locations and more than fifty zones. How do you support both scales in one software suite that is extremely easy to use and understand?

The software also had to serve several personas. The installation engineer designs the system, understands it and installs it. The maintenance engineer debugs a system someone else built. The acoustic engineer adjusts equalisers and other signal processing. Sometimes these were separate people and sometimes they were all the same person. The tool had to work for each role alone and for one person switching between all three. Building a system needed to be easy. Understanding a fully built one needed to be easy too.

## Outside in, not inside out

The old model was placing boxes on a canvas, drawing lines between them and adjusting control panels. Simple for simple systems. An absolute mess of spaghetti wires on complex ones. So we did away with that. We built a more "fixed" setup with the locations front and centre, instead of the DSP and its signal flow. An engineer thinks about where audio comes in and where it goes, not about starting in a signal processor and working out. It's an outside-in model, not an inside-out one.

## An open canvas for when the rules run out

The fixed model was the default, not a cage. Sometimes an engineer needed to leave locations and zones and draw DSP signal paths on an open canvas. So I built a version of the old boxes-and-cables approach for exactly that. It was a tool, not a rule. You drew separate "circuits" (signal in from an input, processing, signal out, all isolated), so it never got as complex as an open canvas by default. You could place any control panel, edit it and wire them together. A small minimap made it easy to scroll about if it did get busy. All pure React and TypeScript.

## No reference to copy

Nobody had tried this before, so it was a huge challenge. Where is the design reference? Where is the product reference? They obviously didn't exist, so we looked elsewhere. GarageBand and Logic were big references. We also had to build the signal-processing panels from scratch: compressors, equalisers, mixers and more. Not exactly something webapps provide "out of the box".

## The panels I'm proudest of

We built modern reproductions of more than 20 audio control panels, from compressors to mixers to graphical equalisers, all in pure React and TypeScript. Each was an implementation twin of its design-system component. Every configuration option in the design existed in the code, and an open-source library I wrote synced the design tokens between the two. Rotary dials, buttons and toggles were shared, so each panel made the next one easier. It was a big undertaking because the UX had to be right.

## Fast, but not throwaway

Technically, we focused on speed of delivery. We wanted to make ideas real as fast as possible without constantly writing throwaway code. That was an extremely tough challenge, especially long before AI tools were useful.

The approach was a careful mix. Quick, cheap prototypes (made clear in the code) proved ideas fast. Once a concept was approved we switched to fully committed Acceptance Test Driven Development. The prototypes used the same "fuzzy frontend" idea I describe in [a later delivery](/software/platform-modernisation-back-on-track/): mostly developer art, focused on interactions and output rather than design correctness. Product and design approval came first, then a formal user story, then full implementation in React, TypeScript and Electron. Playwright ran the tests and Ionic powered the mobile panels. An Android app was planned and we were building towards it near the end, though we didn't get that far.

So we could move extremely fast when we needed to, and deliver extremely regression-proof work once we were locked in. A medium-sized but fairly junior team did it, many of them fresh graduates, and it worked amazingly well. More than 1,000 UI tests covered the whole application and took about 20 minutes to run. Everyone could build knowing they weren't breaking anyone else's delivery. The tests used a reusable domain-specific language (DSL), so when things changed it was easy to update them. Tests don't need to stop innovation, they are there to stop fear of change.

[Janggi](/software/janggi/) is a further evolution of my acceptance-test-driven concept, and you can see and explore it today because it is open source.

## Growing the team

Mentoring is a staple of my career, and with so many junior engineers I was heavily involved. I also pushed hard for people's promotions. That meant giving them problems that would prove to the business they were ready, and making room for them to take those problems on.

## The change of direction

The project went well, but the client's budget and roadmap changed, along with a shift in their leadership. They still loved the modern concept. So they wanted to see if they could release it with the old software as a target: the best of both worlds.

The concept we threw together was to use the modern UI but export a file that the old software could load, without any modification to the old software itself.

## Teaching the new world to speak the old

That took extensive reverse engineering. We worked from sample files, disassembly and code review of the old software, plus a lot of trial and error. We had to understand its XML format, its limitations and how it protected the file with a hash.

The old tool is a fully open-ended editor where you add as many or as few elements as you like. Our model was more fixed, so we had to map one onto the other. Concepts that didn't exist in the old software, like stereo inputs and outputs, had to be expressed in its line drawing. We worked out how it draws lines and drew them in a way that matched the new visuals. Then we added pre-programmed configuration for the mixers and the correct order of processing blocks such as compressors.

Working out how the file's integrity check was generated was a game changer. Once we understood it, extensive unit and acceptance tests made it regression-proof. A lot of the work was poking and prodding, and strong unit tests meant we didn't have to export and load a file every time. A large part of the original acceptance suite migrated into the new project, so it had a solid foundation from day one.

## The result

We had very limited time to prove this, and we had an MVP in weeks. Without it the whole team would likely have been cancelled. Instead the work was extended by roughly another 12 months for everyone. Going from a likely cancellation to an extension is a massive win for a consultancy.

The exported file worked perfectly and the tool was released. Users in testing loved it, and the speed improvement came out of that testing.
