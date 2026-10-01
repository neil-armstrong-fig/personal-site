# AGENTS.md — professional case studies

Anonymised case studies of professional software work. Shared rules and the A/B editorial review are in
`../AGENTS.md`; read `../WRITEUP-ADVICE.md` before drafting, reviewing, or restructuring one.

## Audience and voice

The reader is deciding whether to talk to the developer: a managing director, a recruiter, or a senior engineer,
usually skimming for about a minute. The page has to answer what was delivered, in what role, with what team, and
what changed for the business.

- Put the outcome near the top and use narrative headings, as the TQCC entry does.
- State the role and the team: how many people, who were direct reports, who signed off, and what was his alone to
  decide. The `role` and `team` frontmatter fields render under the title; they are optional but non-blank when set.
- Prefer measured language ("I believe", "partly, I think") over superlatives, and say what a figure measures.
- Concrete over inflated: no marketing language. Never describe a client's internal politics, a colleague's
  circumstances, what the contract paid, or the developer's private circumstances.

## Anonymisation and evidence

- Do not publish current or former employer names or client names in the professional biography, About page, or software case studies in v1; professional work must be anonymised.
- Anonymise fully: no employer, agency, client or product names, and no internal system names. Research about the
  client stays in `research.md`; describe the business generically (“a US lender specialising in second mortgages”).
- Every figure or superlative (“zero regressions”, “4x”, test counts, sizes) needs evidence from the developer stated in
  `qa.md`, and the copy says what it measures (an average, a representative case, his own experience).
- Keep a figure out unless the developer stated evidence for it in `qa.md`. His presumption about what a client does
  now, or an unmeasured saving, is hedged or left out.

## Structure

- Follow `../WRITEUP-ADVICE.md` for length and structure.
- Keep an entry's `sortOrder`, and avoid repeating a claim another entry makes.
- Say what the evidence was (tests, comparisons, demos), not only that work was correct, and cross-link a related
  open-source project where it shows the same technique (for example Janggi's acceptance-test DSL).
- Verify technical claims against the private CV or public repositories. The CV is private reference only: never
  copy it into the public tree or expose its phone number or personal email address.
- A piece over about 1,600 words is a scope question for the developer, since case studies have no chapter mechanism.

## Leadership and outcome interview

When an entry lacks team, leadership or business-outcome detail, ask the developer as the reader would, per entry and
answerable by number:

1. How many people did you lead or work alongside? How many were direct reports, and how many were a cross-functional
   team?
2. Who did you report to on the client side, and who signed off your decisions?
3. Which decisions were yours alone?
4. What happened after you left, or when it ended?
5. What did it cost the client not to do this, and what changed in money, time or risk? Is it a measurement, a client
   statement or his estimate?

Append his answers to that entry's `qa.md` under a dated heading, in his wording, and note anything not to publish.
Where answers disagree with the entry or LinkedIn (team size, titles, figures), report the disagreement; do not pick.
Agent-written `role` and `team` values are flagged in the handoff for his approval.
