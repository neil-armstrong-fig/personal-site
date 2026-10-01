---
title: "Modernising telecom middleware"
summary: "Four products for one of Canada's largest telecoms, and the testing culture that made them safe to change."
careerPeriod: "2015–2018"
role: "Technical lead (towards the end)"
team: "Led 3 engineers from a tech point of view"
sortOrder: 8
technologies:
  - Java
  - Android
  - Postgres
  - WebSockets
  - Gatling
draft: false
seoDescription: "An anonymised case study about building a mobile homepage, an Android widget, opt-in middleware, and an RCS proof of concept for a major Canadian telecom."
---

## Four products for one of Canada's largest telecoms

From 2015 to 2018 I was a core member of our engagement with one of the largest telecom providers in Canada, and towards the end I became its effective lead. Below are the key deliveries. I was also closely involved in mentoring and delivery on the others, even when I wasn't writing the day-to-day code.

Most of it was Java, with a lot of tools around it. All of it carried a lot of traffic and none of it was allowed to fall over.

In the last stretch I led three other engineers from a tech point of view being the longest serving employee on the engagement, though I was still a relatively junior engineer myself. Delivery, deployments and approach were mine. The client chose Java, the server technology and where it ran, so my say was in how it was deployed. We also set it up on our own Jenkins instance for CI tests.

## A homepage for every mobile device

The first piece was the default homepage on the carrier's mobile devices, used by around half a million unique visitors a day. That figure comes from Google Analytics, so it's probably an undercount. Anyone blocking tracking wouldn't appear.

The devices were the challenge. Some were WAP handsets with tiny screens, and many custom Android browsers were very old and badly supported. I rendered the pages as HTML from Java on the server, with JavaScript only where a device could take it, such as the app catalogues. That allowed great caching, so the homepage loaded extremely fast with minimal backend processing. Device detection showed an Android phone Android apps and an iPhone iOS apps where possible.

The key experience was a Google search bar, and every search earned the client money. You can imagine that at over half a million users it was quite a decent revenue stream. I had to style it to match Google's own search bar using CSS old enough to work on those devices. In practice that meant tables, and sometimes no CSS at all. It looked simple but took a lot of testing on WAP devices, small screens and old browsers to get right. A side effect was that the pages were extremely fast, because there was so little to process.

It ran as two load-balanced services. Rendering a simple page isn't much work, so we were well inside our performance limits. I still wrote Gatling load tests and ran them before the first production deployment, as evidence.

## An Android widget on every device

The second piece was a widget preinstalled on all the carrier's Android devices as part of their phone contracts. It was a system app, so customers could disable it but not uninstall it. It sat on the home screen and showed current and upcoming TV shows, apps and offers, tailored to the customer by phone number and drawn from a content API.

It was also on the Play Store, though I expect very few people installed it that way. It ran on every version of Android the carrier supported, so some features were missing on older devices. Different manufacturers also had aggressive battery-saving behaviour we had to navigate. Some customers mistook a widget they couldn't remove for malware, even though it did no tracking on the device. It was funny to read some of those reviews for something I'd built.

## Opt-in middleware

New privacy legislation meant the carrier had to track whether each customer had opted in to personalised advertising across all its web services. I helped build the middleware that did it.

It intercepted backend requests and identified the customer's phone number from the payload, then checked a local cache for their opt-in status. A customer who hadn't decided yet was redirected to an opt-in page, then sent back to the request they'd originally made. Postgres was the source of truth, with the cache in front so the check stayed quick.

This was the most heavily used piece, since it sat in front of many services. It was load balanced like the homepage, with more instances available. The services behind it could effectively be treated as black boxes in a pipeline, so they were fairly isolated from it. Our tests extensively covered the behaviour we delivered, and the client validated the rest from a legal and compliance point of view.

## An early RCS messaging backend

The last piece was an early proof of concept for Rich Communication Services (RCS), the successor to SMS. I built capability discovery, messaging and a gateway. It relied on WebSockets in both directions: the client to my backend, and my backend on to the downstream server. At the time Java didn't handle server-to-server WebSockets especially well, and keeping so many sockets alive was difficult. The operating system's limits on active sockets added real overhead.

## Bringing engineering practices into a legacy estate

Around all four pieces the more lasting change was cultural. The client's other projects, which we worked on and alongside, had no tests, manual deployments, no linting, hard-to-follow code and long release cycles. We brought test-driven development, thorough test coverage and integration testing, plus linting and CI/CD deployments. Some projects were on Java 7 with shims to give them Java 8 features such as lambdas, and some used Lombok.

The effect was a dramatic drop in our lead time to release. The client tracked bugs in Bugzilla, and our releases were such high quality that we were rarely mentioned in it.

## What stayed with me

The hardest part wasn't the middleware. It was the hardware: the huge variety of devices behind the homepage and the widget. Testing for that variety and keeping the code simple enough to survive it was the real work. It has shaped how I work ever since, with a strong testing culture to prove things work and a product-focused mindset.
