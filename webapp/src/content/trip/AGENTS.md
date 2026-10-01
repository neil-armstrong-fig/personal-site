# AGENTS.md — trip content

Cycling trip stories, their chapters, photographs, clips, Strava data and ride maps. The loaders, schemas and Strava
code sit beside the entries in this folder. Shared rules (language, schema invariants, drafts, the A/B editorial
review) are in `../AGENTS.md`; read `../WRITEUP-ADVICE.md` before drafting, reviewing, or restructuring a trip story.

## Audience and voice

The reader is there for the story: friends, fellow tourers, and people weighing up a similar route. Cycling is the
substantial secondary section of the site, so the writing is allowed to be personal where the software pages are
not.

- Keep the developer's own sentences, jokes and phrasing. Polish means UK spelling, typo fixes, tidy emoji, section
  headings and captions in his voice, not a rewrite into the site's technical register.
- Keep the practical detail readers plan with: ferries and ports, logistics, why a decision was made, what a day cost.
- Name the people and organisations he named in his own Strava descriptions; do not redact them. He reviews every
  trip before the public push.
- Never invent or infer events. Draw only from his Strava activities, descriptions and notes, and fold his answers in
  as he gives them, in his own wording.
- Never explain what the `FT` trip prefix stands for anywhere public (slugs, titles, alt text, notes, docs); the
  public name is "Loop of Europe".

## Privacy and source material

Raw trip notes and photographs, including Strava API responses and downloaded Strava photos, belong in an ignored
`private-source/` directory. Only reviewed, sanitised derivatives and approved copy may enter the public source tree.
Apply the portrait's no-EXIF/GPS rule to all trip photography.

## Trip rules

- Trips require at least one location and country, positive optional duration/distance/elevation values, and an end
  date on or after the start date.
- Display trip distance and elevation in both metric and imperial units, computed at build time.
- Videos are limited to short trip clips (below), hosted on the Cloudflare R2 media origin
  `https://media.neilarmstrong.dev` and never committed. No social or third-party embeds.
- Build-time Strava API (`activity:read` only), GPX tooling and read-only Leaflet/OpenStreetMap ride maps are in scope
  from 2026-09-25; keep credentials in the ignored `.env`, never print them, trim 5 km from the first trip start and
  final trip finish, and keep the coordinate-free snapshot separate from the route manifest.
- Ride maps lazy-load their static route manifest, Leaflet and OpenStreetMap tiles only after the native ride-log
  disclosure opens and the map approaches the viewport. Keep visible attribution, a keyboard-native full-screen
  button, scroll-wheel zoom disabled in embedded cards but enabled in full-screen mode, and reduced-motion support;
  preserve all ride names, measurements, photographs and links without JavaScript.
- A trip draft long enough to need chapters follows step 7 of "Adding a trip story".

## Adding a trip story

The developer pastes a first-person draft, often with `@filename` photo and video cues and a hero image. The same steps apply
to every trip; the first run was Belfast to Rotterdam 2023, whose `private-source/trips/belfast-rotterdam-2023/`
folder is the worked example.

1. **Archive.** Save the draft verbatim as `private-source/trips/<slug>/draft.md` beside the originals (ignored
   directory; nothing public). Read `editorial-notes.md` (the retained Strava notes) and the trip's `strava.json`.
2. **Review, then ask.** Compare the draft with Strava for dates, places and route. List gaps and anything that
   doesn't make sense, and put the questions to the developer (ferry ports, named places, why a decision was made, what made a
   photograph special). Never invent or infer events; fold his answers in as he gives them, in his own wording.
3. **Write two versions** beside the draft, unless the developer says otherwise: `article-light-polish.md` (his sentences and
   jokes, UK spelling, typos fixed, tidy emoji such as `:sweat-smile:` to 😅, section headings, captions in his voice)
   and `article-narrative.md` (same facts, restructured around a thread of lessons or themes). Say plainly which
   lines are yours; the developer chooses, and he can keep or drop individual additions. A pun that started as a typo stays,
   in quotes. Then publish both for review as in "Editorial review of long-form copy" in `../AGENTS.md` (trip variants sit in
   `webapp/src/content/trip/entries/<slug>/` as `draft: true` siblings).
4. **Photos.** Look at every image (a small preview is enough) before writing its alt text; never guess from the
   filename. Describe each in `private-source/trips/<slug>/photos.json` (`source`, kebab-case `name`, `alt`) and run
   `pnpm trip:photos <slug>`. It outputs metadata-free 1,600 px JPEGs into `_assets/` and rejects a source under
   1,200 px, so ask for a full-resolution original instead of using a thumbnail. Check every output for private
   addresses, number plates, bystanders and mirror reflections.
5. **Videos.** Describe each clip in `videos.json` and run `pnpm trip:videos <slug>`: it writes an H.264/AAC MP4 (long
   edge 1,280 px, 30 fps, audio kept by default) and a poster to `webapp/public/trips/<slug>/` (posters are small and stay in git; MP4s never do: `.gitignore` excludes them).
   `pnpm dev` plays the local clips, so do not upload while drafts are in review. Set `muteAudio: true` on an
   individual manifest entry when its published clip must have no audio. Phone footage carries GPS `location` tags;
   the script strips them and fails if any remain. Extract frames and look at them before writing alt text. Once the developer approves the
   draft, upload the clips to R2, which is outward-facing, so run the dry run first and get his go-ahead for the real copy:
   `rclone copy webapp/public/trips/<slug> cloudflare-personal-site-videos:personal-site-videos/trips/<slug> --include "*.mp4" --dry-run`,
   then the same without `--dry-run`, then `rclone check` on the same pair and a `curl -sI` of one clip on the media origin
   (200, `video/mp4`, `accept-ranges: bytes`). Keep the remote's `endpoint` at `https://<account-id>.r2.cloudflarestorage.com`
   with no bucket path, never print `rclone config show` secrets, and never commit or echo the credentials in
   `~/.config/rclone/rclone.conf`. Do not upload or delete anything else in the bucket.
   `pnpm build` HEAD-checks every clip URL on the media origin (`validate-build/media/`), so a forgotten upload fails
   the build and the deploy instead of shipping a broken video.
6. **Publish.** Copy the chosen article under the frontmatter of `webapp/src/content/trip/entries/<slug>/index.md`, keeping
   the cover and its `coverAlt`. One figure per line, with non-blank alt text and a caption: images as
   `![alt](./_assets/x.jpg "Caption")`, clips as `![alt](/trips/<slug>/x.mp4 "Caption")` (root-absolute; a relative
   `.mp4` is not processed; the build prefixes the media origin, see `TripVideoOrigin.ts`). Videos use `preload="none"` and never autoplay; the `.jpg` poster is emitted as `data-poster` and
   applied by script near the viewport, because browsers fetch `poster` eagerly and a clip-heavy chapter then fails LCP. Every photo or video the developer
   selected — each `photos.json`/`videos.json` entry, and everything he tagged `@filename` in the draft — must end
   up in the published article; never process one into `_assets/`/`webapp/public/trips/<slug>/` and then quietly leave it
   out. If a selected photo or video is later cut, remove its manifest entry and delete the stale derivative (and its R2 object, with the developer's approval) in the
   same pass rather than leaving an orphaned file, and never cut or delete one the developer selected without asking him
   first.
7. **Split into chapters once it's long.** Split whenever the stretch between two rest/transition days would
   otherwise exceed roughly **1,600 words or 35 figures** (the reasoning and the Tokyo to Seoul calibration behind
   this number are in `../WRITEUP-ADVICE.md`). Use the nearest rest day as the chapter boundary; only cut at an
   existing `##` heading instead when no rest day falls at a clean point inside an over-length stretch, and never
   invent, move or reword a heading purely to create a boundary. This is opt-in per trip — most trips are short
   enough to stay one page. Each chapter is its own
   `webapp/src/content/trip/entries/<slug>/part-<n>-<chapter-slug>.md`, matching the `tripChapters` collection's
   `*/part-*.{md,mdx}` glob, with `title`, `order`, `startDate`, `endDate`, `coverImage` (`./_assets/...`, reuse a
   photo already in that chapter rather than commissioning anything new), `coverAlt`, `seoDescription` and `draft`
   frontmatter (`webapp/src/content/trip/trip-chapter/TripChapterContent.ts`). The overview (`index.md`) keeps the trip's
   intro and its own first, shortest part. Chapter routing, the "Part n of N" heading, the contents list, prev/next
   links and route-map highlighting are all derived from this collection at build time, so re-splitting later (as
   happened when Tokyo to Seoul's six chapters became ten) needs no code changes, only content moves. Chapter
   titles and descriptions are new copy — flag them in the handoff like any other agent-written text.
8. **Verify.** Run `pnpm checks` and `pnpm build`, and confirm the built page has every figure, caption and video.
   `webapp/lighthouserc.json` lists only some routes, so audit a new trip page with a temporary config (see `pnpm lighthouse`). If the trip has chapters, check `lighthouserc.json` still points at the current
   heaviest chapter route, not one a later re-split renamed or removed. The developer may defer a failing LCP; report it
   rather than hiding it.
9. **Hand off.** Report the gate results and any open questions. The developer approves the copy, images and clips.
   Leave the index and history untouched.
