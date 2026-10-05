# AGENTS.md — shared

Two jobs: `config/` holds the base tool configuration every package extends, and `src/` holds what more than one
package needs.

## What belongs here

`src/contact/` is the contact form's wire contract: the field names and limits, the validation, and the JSON the Worker
answers with. The webapp's form and `contact-worker` both import it, so the two cannot drift apart. Reach for `shared`
where a thing is a contract between packages, not wherever code happens to repeat.

- **Change a lint, format, tsconfig or vitest rule here, not in a package.** Packages extend these files.
- `console.info` is reserved for deliberate structured operational events. `console.log` and `console.debug` remain
  disallowed by the shared lint rule.
- `src/` is consumed as raw TypeScript through the `exports` map. There is no build step; do not add one.
- Anything here is imported as `@personal-site/shared/<path>`. Within `shared`, one folder reaches another by that same
  name and a sibling as `./X`; `../` is refused, and an `@src` alias cannot work in raw source another package compiles.
- Pure functions and plain types only: nothing that touches the DOM, Astro or the Workers runtime.
- **This package may not import any other workspace package.** It is the bottom of the dependency graph and a lint error
  enforces it. If something here needs `webapp` or `contact-worker`, it does not belong here.
