# AGENTS.md — open-source project content

Open-source project write-ups (Janggi, TQCC). Shared rules and the A/B editorial review are in `../AGENTS.md`; read
`../WRITEUP-ADVICE.md` before drafting or restructuring one.

## Audience and voice

The reader is an engineer, architect or technical lead judging how I approach design, testing and delivery. The
project is useful in its own right, and the write-up shows the decisions behind it.

- Explain the architecture, tests, delivery tooling and trade-offs, not only the finished interface.
- Do not copy README files wholesale; rewrite them for a personal case-study audience.
- Cross-link a related professional case study where it shows the same technique, and the reverse.
- Verify technical claims against the repository.
- Projects are listed by an explicit, required `sortOrder` (1 first), not by date, so a new entry can sit last. An optional
  `heroBordered` adds a light border to the case-study cover for a pale screenshot that blends into the page. An optional
  `cardTitle` replaces the title on list cards only (the card adds the full title for screen readers).
- Projects require at least one technology. Case studies and projects have no chapter-splitting mechanism today, so a
  draft long enough to need one is a scope question for the developer, not something to build unilaterally.

## Adding or replacing a project screenshot

Use this workflow for a software case study whose image is a capture of a real website. The TQCC rides-page cover
(`webapp/src/content/project/entries/tqcc/_assets/tqcc-ride-schedule-page.png`) is the worked example.

1. **Capture the real page.** Use the current public page, or a reviewed local build when the public page is not
   the intended version. Do not recreate it with image generation and do not upscale the old screenshot. Confirm
   the exact route and visible state; ask the developer if the live page has changed materially from what the case study
   should preserve.
2. **Capture a high-resolution source.** Unless the existing composition calls for something else, use a 1200×630
   CSS viewport at 2× device scale for a 2400×1260 PNG. Wait for network idle and `document.fonts.ready` before
   capture. This keeps the established social-card ratio and gives Astro real source pixels for its current 1280px
   case-study derivative. Do not add a browser-automation dependency just for the capture; use the installed
   headless Chromium tooling.
3. **Inspect before publishing.** View the captured PNG at original detail. Check that the intended content is
   legible and complete and that it contains no private information, transient overlays, cookie prompts, browser
   chrome, or accidental focus/hover state. Keep a descriptive kebab-case filename, put it in the project's
   `_assets/` folder, and write alt text from the inspected pixels rather than from the filename.
4. **Verify the file.** Keep the source as lossless PNG. Inspect its dimensions and metadata; it must contain no
   EXIF, GPS, text, orientation, or embedded colour profile. A clean Chromium capture normally contains only the
   `IHDR`, `IDAT`, and `IEND` PNG chunks. Confirm the source is larger than the widest derivative requested by the
   consuming Astro components instead of relying on an upscale.
5. **Verify the result.** Run `pnpm checks` and `pnpm build`, inspect the generated image widths and formats, and
   preview the consuming case-study page at 390px phone and 1440px desktop widths. Check the actual selected
   responsive source, sharpness, crop, aspect ratio, and horizontal overflow. Report both gate outcomes and the
   rendered checks in the handoff. Lighthouse is not needed for an ordinary image-quality change.
