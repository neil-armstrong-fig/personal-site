---
title: "Janggi"
sortOrder: 1
summary: "An offline-capable Korean chess app, built as much to show how I engineer software as to be played."
datePublished: 2026-09-07
dateModified: 2026-09-29
technologies:
  ["React 19", "Redux Toolkit", "TypeScript", "Tailwind CSS 4", "Vite", "Playwright", "Fairy-Stockfish (WebAssembly)"]
repositoryUrl: "https://github.com/neil-armstrong-fig/janggi"
liveUrl: "https://janggi.neilarmstrong.dev/"
liveLabel: "Play Janggi"
heroImage: "./_assets/janggi-korean-chess-board.png"
heroAlt: "The Janggi app mid-game: a Korean chess board with red Han pieces at the top, green Cho pieces at the bottom, and a palace marked with diagonals in each fortress."
featured: true
draft: false
seoTitle: "Janggi case study: an offline Korean chess PWA | Neil Armstrong"
seoDescription: "How Neil Armstrong built Janggi, an installable Korean chess app with an in-browser bot, acceptance-test-driven delivery, and architecture enforced by lint."
---

## A complete game, not a rules demo

Janggi is often called Korean chess. If you know chess or xiangqi, parts of it feel familiar. That doesn't last long! Cannons have to jump to move. Players can pass. Each fortress has diagonal lines. The generals can even face each other in a standoff called bikjang.

The app is fully playable on a phone or desktop. Play a friend across the table or take on a bot. Pick casual or scored rules. Follow the illustrated guide. Install it from the browser and keep playing offline.

Behind all that sit more than 1,200 unit tests and 1,156 browser test cases (578 Playwright scenarios, each run at desktop and mobile sizes).

## Building the version I wanted to play

I always wanted to learn janggi, but every online version I found was hard to get into or clunky to play. None of them made the game shine. Next to a good chess app it was obvious how much better it could be.

So I built the version I wanted to play. Just as much, I wanted to show how I build software: acceptance-test-driven development, AI-native delivery and clear code with strict boundaries. It's also a working reference I can point future projects and coding agents at. No more explaining the same decisions from scratch.

Everything below is in the repository. Where I could, tooling enforces it instead of good intentions.

## Research, design, code and delivery

I did all of it. The rules needed some deep research in English and Korean sources. Where they disagree I recorded the decision and its sources in the repository. I designed the experience, wrote the code and set up the delivery pipeline. The interface gets people playing fast instead of putting menus in their way.

## Making it feel good to play

I didn't want to stop at a technically correct board game. Finishing games earns XP that unlocks new boards and piece sets. Animations, sound effects and haptics give moves some weight. An adaptive soundtrack changes as the match develops. It's synthesised in the browser with Korean instruments. Don't like it? You can turn all of it down.

The bot was another chance to stretch myself. Fairy-Stockfish gives eight nominal Elo strengths, and the app's own rules engine checks every move it plays. Each ladder keeps its own ratings, results and progress. Everything persists locally with no account (though I might add one later :)).

## Architecture that makes mistakes harder

First decision: keep the rules independent of the interface. They're plain TypeScript with no React, store or DOM. A state goes in and a state comes out. That makes them cheap to test thoroughly. The same engine referees people and the bot.

That boundary runs through the whole app. Lint stops the rules engine importing React or Redux. It stops the store importing components. Cross one of those lines and the build fails, instead of waiting for someone to spot it in review. Files sit beside the one thing that uses them and only rise as far as their nearest shared caller. Where a file lives tells you how much breaks if you change it.

Offline play shaped the rest. Fairy-Stockfish runs in the browser as WebAssembly, and the app's own engine validates every move it returns. Your game and progress stay on the device. No account or server gets between a player and a game.

## Testing the rules and the real interface

- **Acceptance tests first.** Each feature starts as a Playwright spec in plain given/when/then language. I watch it fail for the right reason before writing any code. The main, PWA and bot suites hold 578 scenarios. Each runs at desktop and mobile sizes, so that's 1,156 browser test cases. The specs talk to a small domain-specific language, and only its Playwright layer touches locators. Lint keeps it that way.
- **Property-based tests.** On top of 1,200+ Vitest unit tests, fast-check plays thousands of random legal games and checks what must hold after every move.
- **Full UI testing.** The same acceptance suite drives the real interface on desktop and phone viewports. Most runs use reduced motion, with dedicated full-motion scenarios too. Pretty rare for a game!
- **Mutation as a habit.** A test I've never seen fail isn't one I trust, so I deliberately break the code to check the test notices.
- **A strict pipeline.** TypeScript at its strictest. ESLint with no warnings. One command for the whole gate. GitHub Actions runs the checks, tests a production build and deploys. Then it runs the acceptance tests again against the live site.
- **Written for agents as well as people.** I build with AI coding agents every day, so the repository has `AGENTS.md` files that describe the architecture and conventions. I review and commit everything.

## A game and a reusable reference

The result is the janggi app I wanted for myself. It's complete enough to learn the game and fun enough to keep coming back to. It's also a working reference for the architecture, testing and delivery I want future projects and coding agents to follow.

Janggi is very popular in Korea. This version has few players today, so I won't pretend adoption is the measure. What I can point to is a finished, installable game. You can check its engineering claims in the public code and the live app.

There's plenty of room to build on it: online matches, richer game analysis and everything else people expect from the big chess sites. The rules engine, boundaries and tests give that a solid base. The app is complete on its own today. Really, it's built for me, but I hope others enjoy it too.

The [repository README](https://github.com/neil-armstrong-fig/janggi#readme) goes deeper into the game, progression system, engineering approach and developer setup.
