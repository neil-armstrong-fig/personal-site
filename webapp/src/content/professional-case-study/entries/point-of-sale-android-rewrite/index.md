---
title: "Rewriting point of sale for Android"
summary: "Winning an Android point-of-sale rewrite with a one-week prototype, then shipping it on a locked-down payment device."
careerPeriod: "2018–2019"
role: "Technical owner of our side (second half)"
team: "4 engineers on our side, 3 on the client's"
sortOrder: 7
technologies:
  - Kotlin
  - Android
  - Coroutines
  - Point of sale
  - Automated testing
draft: false
seoDescription: "How I built the item-selection prototype that won an Android point-of-sale rewrite, then helped ship it on a locked-down payment device."
---

## A week to win the work, just over a year to ship it

Point of sale software is generally invisible to retail customers. They bring an item to a till and pay, and only notice the software when it doesn't work. A client of ours had a point-of-sale product that "just worked", and worked well, but it only ran on iOS hardware. For small businesses, where cost is everything, that was a barrier. Their answer was an Android version for those who couldn't afford the iOS experience. A complement to the iOS product, not a replacement.

We won the work by building a working end-to-end prototype in a week. I built its most difficult and critical screen: item selection. About twelve months later the first production release shipped, written entirely in modern Kotlin. By the time I rolled off it was a core offering for the client's business.

## Building the case in a week

The task was a proof of concept of a complete point-of-sale flow: PIN-based login, item selection, "processing payment" and tax calculation. There were three of us, starting from almost nothing. Kotlin helped. We moved quickly while other proposals pitching for the project were using Java.

My part was item selection. In my view it's one of the most complex UX and UI problems in point of sale. A cashier has to find and select items as fast as possible, in any order, with no warning of what comes next. Generic Android layouts don't cover it either.

## A screen no library provides

The client's backend defined the item-selection screen. A payload described a grid, categories, pages, modifiers, search and quantity entry, and our app had to reproduce it exactly as the client's back-office web app showed it. The iOS app was a useful reference, but the backend was the specification.

Android had no item-selection grid layout or library, so the screen was bespoke. I used Android's built-in tools in a way they don't normally go together, then wired up the gestures and theming so it felt fast and looked right.

We demoed the prototype to the client and they reacted extremely positively to how much we'd built in so little time. The statement of work was signed. We'd beaten other proposals that couldn't produce as much as quickly.

## From prototype to product

We then turned the prototype into the real thing, working closely with product and design on the client's side. That meant processing real payments, capturing real signatures, calculating complex tax rules and talking to a comprehensive backend built for the iOS app. Tax rules varied by US state and even by item, so the backend payload described them and we had to parse and apply them. Thankfully the backend was extremely easy to work with. We asked for some changes and kept up with constant changes made for the iOS build.

I was part of the team from the start and led specific areas: item selection, the transparency effects, payment and tax, the Clover integration and printing. There were four of us on our side and three on the client's, with a separate client-side lead for the whole project. Later I became team lead for our side.

Features came from the client's product and engineering leads, but we held full technical ownership of implementation. How to build it, the testing strategy and how we proved it was correct were ours to decide.

## Building it better

As always, I wanted to build it better, not just build it again. The iOS code had no automated tests apart from a large Appium QA suite disconnected from the codebase. On Android we started with test layers: unit tests over pure functions rather than stateful objects, coroutines for async work, continuous integration, tracked coverage and UI tests with Android's built-in tooling.

Printing is a good example. A receipt had to be rendered and printed, so in tests we rendered it as an Android layout and checked that. The same layout then went to the printer. Being able to test printing was incredibly useful.

I brought the same instinct to later work, taking it further with acceptance testing on [Janggi](/software/janggi/).

## Working within a locked-down device

The app ran on a Clover device, a locked system. That was a double-edged sword. We had limited memory and CPU, poor colour reproduction that made it hard to make the app look great, and some standard Android features missing. In return the device gave us signature capture and contactless payment hardware, which we integrated through the Clover SDK.

We also had to support external devices and a dual-display terminal, so the same outcome sometimes needed several hardware interfaces. A mapping layer between our code and each SDK kept the app from being locked in to one piece of hardware.

The device limits shaped some small decisions. One design showed the item-selection or payment screen behind the settings screen through a transparency effect. It hit resource limits, so I worked on it hard and massively improved its performance by trying different approaches that gave a similar look.

## Outcome

The release went well and the app became a core offering for the client's business. The client was later acquired by a larger point-of-sale company, partly, I think, because of the Android offering. I'd rate it as one of my most effective deliveries and an extremely enjoyable one, thanks to the interesting domain.
