---
title: "A serverless insurance platform"
summary: "Delivering a full digital motor-insurance journey on AWS serverless in twelve months, and the developer experience that made that pace possible."
careerPeriod: "2021–2022"
role: "Tech lead"
team: "4 engineers, mentored and one to ones but not line-managed, in a cross-functional team of about ten"
sortOrder: 5
homepageOrder: 2
technologies:
  - TypeScript
  - AWS CDK
  - AWS Lambda
  - DynamoDB
  - EventBridge
  - SQS
  - Storybook
draft: false
seoDescription: "An anonymised case study about delivering a serverless motor-insurance platform on AWS in twelve months, with a focus on developer experience."
---

## A full insurance journey in twelve months

I was tech lead on a new UK digital motor-insurance platform built on AWS serverless. A cross-functional team of about ten delivered the full sign-up journey, and two other teams covered policy and account management. All of it in twelve months. Renewals were left out of the first release on purpose.

I led four of the engineers technically, with mentoring and one-to-ones, though I wasn't their official manager. I owned the tech stack, the front-end approach, the CI/CD, onboarding and the testing strategy, and chose the car-registration and address-lookup data suppliers. The client's product owner signed off decisions, and bigger ones also went past my own head of engineering.

## The problem

Car insurance is cyclical. People do it about once a year and ideally don't want to interact with it otherwise. When they do, they want to get in and out as fast as possible.

The client sold quotes and support only by phone and in person, which doesn't scale. It needed a digital channel to reach a younger audience and cut costs.

So how do you make sign-up easy, renewal pain-free and any issue quick to solve? That was our problem. The cherry on top: car insurance is high margin and low throughput, so how do you also save on infrastructure costs?

## All in on serverless

We went all in on serverless. Infrastructure scales down to zero when there are no users (usually overnight) and reacts when demand arrives, say when a marketing campaign wins.

The stack is fairly standard these days: AWS CDK, Lambda, DynamoDB, EventBridge and SQS queues. We tried RDS first because we knew it better than DynamoDB. It doesn't play nicely with Lambda because of connection-pool problems. RDS Proxy would have fixed that, but it has constant running costs. DynamoDB is pay per use.

But that's only half of it. How do you build it quickly and well? Insurance can be a slow business, but that isn't the business I'm in. I want to deliver high value quickly.

## The quote journey

The first thing to nail in car insurance is the quote journey. Customers use it most, it's how you make revenue, and get it right and the renewals tend to follow. That took research: what a typical flow looks like, where the pain points are, how to make it fast and easy. We took the UK government website approach. Nobody wants to be there, so let them finish quickly and successfully.

It took a big chunk of the team's time early on. And it wasn't just a great quote journey, we also had to choose the best data provider for car registration and address lookups, then integrate the downstream quote service, add-on providers and payment system.

This was a large cross-functional team of product, design and engineering. It was also the first time my consultancy had run one in-house, so it was a proving ground.

## Developer experience

A shiny UI isn't enough. We also needed easy-to-use backend services, built quickly. I was constantly working with product and design, mentoring and delivering on the front end. I was also working on the best developer experience I could give the team. That meant four questions:

- How do we get people to run a serverless application themselves easily?
- How do we let them debug it easily?
- How do we onboard new engineers quickly and painlessly?
- How do we fail fast and keep the build green as much as possible?

Solve these early and engineering teams can do their best work. They might even enjoy it.

**Onboarding.** A guided bootstrap script got a new engineer running. It pulled local secrets from 1Password with its command-line tool and installed dependencies (both the Yarn and Node versions). If the environment wasn't ready it gave clear steps. It offered an AWS account selection screen so you could deploy to any account you had access to, then validated the deployment. It ran until it needed something from you, you did it, and it carried on until everything was up. You needed very little knowledge because it was so clear what to set up.

**Their own accounts.** Everyone had their own AWS account to deploy to and test on. Lambda, DynamoDB and the queues cost nothing when idle, so an unused account cost pennies. No runaway costs per environment.

**Testing and debugging.** Every Lambda had post-deployment tests that ran its real code on the deployed account, and a failure posted to Slack. Separate "debug tests" ran the Lambda code locally in TypeScript against any configured AWS account. That let me debug local code against real AWS services.

**Storybook for product and design.** Every design-system component built in code was rendered in Storybook, with options to show variants, styles and colours. Designers had full access, so a developer didn't need to attend validation sessions. We could also simulate steps in the quote journey to see what it looked like at any point.

**Fast feedback from the client.** An end-to-end journey was up early, so the client could test the flow and give quick, regular feedback.

## What we delivered

We delivered the full sign-up journey and policy management within the twelve-month deadline, covering all the edge cases the client required. There was some scope creep as we found missing flows. We tackled those quickly.

Renewals were cut from the first release. They only fall due after twelve months, so we focused on what would bring in customers and revenue.

## What I would do differently

- **Agree responsibilities and goals from the start.** It was my first time managing a cross-functional team, and clear roles and goals from day one would have been far more effective.
- **Choose a delivery platform and stay on it.** We moved from Bitbucket to AWS CodeDeploy to GitHub Actions during development. Lots of churn.
- **Keep design and engineering in sync.** Things drifted as more requirements came in. I got much better at this on later projects.
- **Use Playwright, not Cypress.** The Cypress tests were extremely valuable but so slow they could bring a whole laptop to a halt. Playwright is a much better option, especially now. It's what I later used for [Janggi](/software/janggi/).
