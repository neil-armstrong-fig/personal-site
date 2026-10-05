---
title: "Janggi"
sortOrder: 1
summary: "A local-first Korean chess app with optional sync and invite-only online play, built as much to show how I engineer software as to be played."
datePublished: 2026-09-07
dateModified: 2026-10-05
technologies:
  [
    "React 19",
    "Redux Toolkit",
    "TypeScript",
    "Tailwind CSS 4",
    "Vite",
    "Cloudflare Workers",
    "Cloudflare D1",
    "Durable Objects",
    "Playwright",
    "Fairy-Stockfish (WebAssembly)",
  ]
repositoryUrl: "https://github.com/neil-armstrong-fig/janggi"
liveUrl: "https://janggi.neilarmstrong.dev/"
liveLabel: "Play Janggi"
heroImage: "./_assets/janggi-korean-chess-board.png"
heroAlt: "The Janggi app mid-game: a Korean chess board with red Han pieces at the top, green Cho pieces at the bottom, and a palace marked with diagonals in each fortress."
featured: true
draft: false
seoTitle: "Janggi case study: a local-first Korean chess PWA | Neil Armstrong"
seoDescription: "How Neil Armstrong built a local-first Korean chess PWA with an in-browser bot, optional Google sync, invite-only online play, and a Cloudflare backend."
---

## A complete game, not a rules demo

Janggi is often called Korean chess. If you know chess or xiangqi, parts of it feel familiar. That doesn't last long! Cannons have to jump to move. Players can pass. Each fortress has diagonal lines. The generals can even face each other in a standoff called bikjang.

The app is fully playable on a phone or desktop. Play a friend across the table, invite one to a private online room, or take on a bot. Pick casual or scored rules for local games. Follow the illustrated guide. Install it from the browser and keep playing offline. An optional Google account carries your progress between devices, and the playable core is available in Korean.

Behind all that sit more than 1,200 unit tests and over 1,500 browser test cases. That's over 750 Playwright scenarios, each run at desktop and mobile sizes.

## Building the version I wanted to play

I always wanted to learn janggi, but every online version I found was hard to get into or clunky to play. None of them made the game shine. Next to a good chess app it was obvious how much better it could be.

So I built the version I wanted to play. Just as much, I wanted to show how I build software: acceptance-test-driven development, AI-native delivery and clear code with strict boundaries. It's also a working reference I can point future projects and coding agents at. No more explaining the same decisions from scratch.

Everything below is in the repository. Where I could, tooling enforces it instead of good intentions.

## Research, design, code and delivery

I did all of it. The rules needed some deep research in English and Korean sources. Where they disagree I recorded the decision and its sources in the repository. I designed the experience, wrote the code and set up the delivery pipeline. The interface gets people playing fast instead of putting menus in their way.

I also started putting the game into Korean to reach players in Korea. A native speaker reviewed the translated core, from the welcome through to the result of a game. It is still a work in progress. Word-heavy areas such as the account and online screens, the style editor, the guide, and the legal pages remain in English. They are a lot to translate for less value today.

## Making it feel good to play

I didn't want to stop at a technically correct board game. Finishing games earns XP that unlocks new boards and piece sets. Animations, sound effects and haptics give moves some weight. An adaptive soundtrack changes as the match develops. It's synthesised in the browser with Korean instruments. Don't like it? You can turn all of it down.

The bot was another chance to stretch myself. Fairy-Stockfish gives eight nominal Elo strengths, and the app's own rules engine checks every move it plays. Each ladder keeps its own ratings, results and progress.

Everything still persists locally with no account required. Sign in with Google and progress, ratings, selected preferences and custom styles stay in step across devices. Your current game stays on the device. If the API is unavailable, sync pauses and local play carries on.

Online play is for invited friends. One player makes an eight-character room code or sends a link, and the other joins a casual game. I've used it for real games with friends. If somebody puts their phone away, an optional notification tells them when it is their turn.

## Architecture that makes mistakes harder

First decision: keep the rules independent of the interface. They're plain TypeScript with no React, store or DOM. A state goes in and a state comes out. That makes them cheap to test thoroughly. The same engine now referees local players, the bot and online rooms. That lets the same engine run in the web app and the Cloudflare Worker.

That boundary runs through the whole app. Lint stops the rules engine importing React or Redux. It stops the store importing components. Cross one of those lines and the build fails, instead of waiting for someone to spot it in review. Files sit beside the one thing that uses them and only rise as far as their nearest shared caller. Where a file lives tells you how much breaks if you change it.

Offline play still shapes the rest. Fairy-Stockfish runs in the browser as WebAssembly, and the app's own engine validates every move it returns. Local storage remains the source of truth. Google sign-in is optional, asks only for an OpenID identifier and stores no Google name or email address.

The online service is a Cloudflare Worker with D1 and one Durable Object per room. Both browsers and the room run the same rules engine, but the room has the final say on every move. Getting the lifecycle right was the hard part. A room rebuilds a player's board after a dropped connection, can hibernate between moves and expires itself when it is no longer needed. Idle games therefore cost nothing to run, which keeps a project with no revenue inside Cloudflare's free tier.

The Korean work has boundaries too. Translated components read from a typed message object, so a missing Korean entry does not compile. Sentences are functions because Korean cannot be assembled in English word order. A static `/ko/` page and language-aware addresses give Google and Naver Korean crawler copy without waiting for JavaScript.

## Testing the rules and the real interface

- **Acceptance tests first.** Each feature starts as a Playwright spec in plain given/when/then language. I watch it fail for the right reason before writing any code. The main, PWA and bot suites hold over 750 scenarios. Each runs at desktop and mobile sizes, so that's over 1,500 browser test cases. The specs talk to a small domain-specific language, and only its Playwright layer touches locators. Lint keeps it that way.
- **Property-based tests.** On top of 1,200+ Vitest unit tests, fast-check plays thousands of random legal games and checks what must hold after every move.
- **Full UI testing.** The same acceptance suite drives the real interface on desktop and phone viewports. It covers account sync, two-player rooms, reconnection, Korean and the service worker that shows turn notifications. Most runs use reduced motion, with dedicated full-motion scenarios too. Pretty rare for a game!
- **Mutation as a habit.** A test I've never seen fail isn't one I trust, so I deliberately break the code to check the test notices.
- **A strict pipeline.** TypeScript at its strictest. ESLint with no warnings. One command for the whole gate. GitHub Actions runs the checks, tests a production build and deploys. Then it runs the acceptance tests again against the live site.
- **Written for agents as well as people.** I build with AI coding agents every day, so the repository has `AGENTS.md` files that describe the architecture and conventions. I review and commit everything.

## A game and a reusable reference

The result is the janggi app I wanted for myself. It's complete enough to learn the game and fun enough to keep coming back to. It's also a working reference for the architecture, testing and delivery I want future projects and coding agents to follow.

Janggi is very popular in Korea. This version still has few players, so I won't pretend adoption is the measure. I have played real online games with friends, and you can check the engineering claims in the public code and the live app.

There's plenty of room to build on it, including clocks and richer game analysis. The rules engine, boundaries and tests give that a solid base. The app is complete on its own today. Really, it's built for me, but I hope others enjoy it too.

The [repository README](https://github.com/neil-armstrong-fig/janggi#readme) goes deeper into the game, progression system, engineering approach and developer setup.
