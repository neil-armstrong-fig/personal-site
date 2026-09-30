---
title: "Build it again, but better"
summary: "Rebuilding a critical loan-processing application and more than 50 Lambda functions, with acceptance tests as proof that nothing regressed."
careerPeriod: "2025–2026"
sortOrder: 1
homepageOrder: 3
technologies:
  - TypeScript
  - React
  - Redux Toolkit
  - AWS Lambda
  - Terraform
  - Playwright
  - Acceptance testing
draft: false
seoTitle: "Build it again, but better | Software case study"
seoDescription: "How I rebuilt a critical Vue 2 loan application and 50+ AWS Lambdas in React and TypeScript, with acceptance tests proving no regressions."
---

## A critical loan tool, rebuilt with proof it still worked

I took two legacy systems at a US lender specialising in second mortgages and home equity products and rebuilt both with no regressions. The first was a Vue 2 front end that loan officers used daily to process loans. The second was an estate of more than 50 JavaScript AWS Lambda functions. The rewrite took four months with a team of two. The Lambda migration took four weeks with a team of three. Both times I wanted evidence that the new code behaved the same, not just a belief.

## Two projects, one engagement

**The front end.** A cornerstone Vue 2 application, used every day by more than 200 loan officers, had no tests, no linting and code nobody had looked after. I led its complete rewrite in modern React.

**The Lambdas.** More than 50 Lambda functions were written in plain JavaScript and edited directly in the AWS console. No tests, no linting, no shared code. Most sat behind event queues. I led the rewrite into TypeScript with shared code, Terraform and fast CI/CD pipelines.

## Why I did not just point an AI at it

The application was critical to how the business processed loans. It was full of workarounds and edge cases, and everything had to work exactly the same or better. I could have thrown AI at the old code and it might well have worked. But it would have given us no proof, and for software that must be correct "it seems to work" isn't enough.

So I brought in two things. First, Acceptance Test Driven Development, the core of how I deliver software that has to be right. Second, a long, deep read of the old code and behaviour so I could write extremely detailed user stories to drive those tests.

## Defining the behaviour first

The definition phase was long but accurate. I wrote over 200 stories from deep dives into the old codebase, and product stakeholders on the business side confirmed each step. Those stories drove more than 1,000 acceptance tests, effectively 1,000+ UI tests.

Reading the code this closely changed the scope. We removed things nobody used and added things people needed:

- **Removed:** unused admin features that were complex to re-implement, table fields that were shown but never populated, and workflows behind feature flags nobody had turned on for years. Plus many other things.
- **Restored:** browser history. The Vue 2 state management broke on back and forward, so the old code blocked those buttons with custom code. The React version supports them properly. Even simple things like linking out to external services correctly. Plus countless small quality-of-life changes to make the software a joy to use compared to before.

## Tests that cannot see the browser

Each test reads as plain language. It calls a domain-specific language (DSL) layer that handles orchestration and turns failures into human-readable errors. That layer is the only one that touches Playwright. The DSL gets just the page object in its constructor and drives Playwright through public methods, so a test can't reach Playwright even by accident. It's the same pattern I use in [Janggi](/software/janggi/).

That separation matters for a rewrite. The tests describe behaviour, not implementation. People and coding tools can both read them, and they survive changes underneath.

## Proving zero regressions

The acceptance suite was one layer of evidence. We also ran extensive A/B comparisons against the old code and demoed new features live to product every week. A manual regression suite ran over the entire delivery twice, once for UAT and once for production.

The result was a full replacement of the Vue 2 application with no regressions. It gained lint rules, unit tests, clean code and a clean folder structure, plus a better user and developer experience. The acceptance suite stays as a regression net, so future changes can be proved quickly and with little fear.

## Working with AI on two different setups

All the code was written with AI tools and reviewed by people. On the React rewrite one of us used Claude Code and the other GitHub Copilot. No `AGENTS.md` existed yet, so we had to support both tools. Over the four months our use of AI and our harnesses matured enormously. By the end I think we could have done it in four weeks with what we'd learnt.

## The Lambda migration

A new AWS environment was being rolled out and the deadline was fixed. Every environment (dev, UAT, staging and production) had shared one AWS account. The new plan was one account per environment, and editing Lambdas in the console wouldn't scale to that.

The first task was to pull the Lambdas into a repository, make the code reusable, and make it deployable. We went further:

- **TypeScript**, with types wherever they were easy to add, plus extensive tests and linting.
- **Shared code**, including database access services, and a single codebase for UAT and production.
- **Real configuration.** Environment variables injected properly, and plain text credentials moved into Secrets Manager.
- **Less code.** Dead code deleted and complex logic rewritten as small functions.
- **Atomic, deterministic deployments.** The same code goes to both environments, configured through Terraform.
- **Opt-in permissions.** Infrastructure moved to a strict, opt-in permission model in Terraform, and I worked with the DevOps team to customise and update their core modules.
- **Minification**, which cut the average bundle from about 10 MB to about 200 KB and improved cold starts.

A migration like this would normally have taken me closer to four months just to reach an MVP, without the TypeScript and everything else. With our approach to AI and the expertise behind it, it took four weeks with no regressions. This time the repository had an `AGENTS.md` from the start.

## What I took from it

A fast rewrite is only as good as your proof that it still works. Deciding what "the same" means and writing it down as stories was the hard, valuable part. The AI made building fast. The acceptance tests made it safe.
