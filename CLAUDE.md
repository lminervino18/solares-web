# CLAUDE.md

Guidance for Claude Code and other coding agents working in this repository.

## Project purpose

This repository contains the static frontend website for Solares, a football team.

It uses React, TypeScript and Vite. It has no backend, database, authentication or custom
API. All content is local and strongly typed.

User-facing website content is written in Spanish. Technical identifiers and repository
documentation are written in English.

Main routes:

- Inicio — `/`
- Historia — `/historia`
- Campeonatos — `/campeonatos`
- Estadísticas — `/estadisticas`
- Goles — `/goles`
- Femenino y Mixto — `/femenino-mixto`

Implemented pages: **Inicio** (presentation with an interactive crest, the crest timeline and the
kit gallery), **Historia** (eight chapters, chapter index, contextual photo galleries and the
origin map), **Campeonatos**, **Estadísticas**, **Goles** and **Femenino y Mixto** (Cambalache and
Cambalares). Do not invent sports content for any of them.

## Stack

- React 19, React Router 7, TypeScript 6, Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`) with CSS custom properties as design tokens
- Class Variance Authority for component variants, `clsx` + `tailwind-merge` via `cn()`
- Radix UI primitives, Lucide React icons, Motion for React
- Zod, React Helmet Async
- Vitest + React Testing Library, Playwright
- ESLint flat config (typescript-eslint), Prettier

## Language rules

- User-facing copy must be written in Spanish.
- Code identifiers, component names, filenames and folders must be written in English.
- Commit messages, `README.md` and `CLAUDE.md` must be written in English.
- Do not mix languages inside the same user-facing sentence.
- Do not translate or modify the name `Solares`.

## Repository rules

Before editing:

```bash
git status
git branch --show-current
git remote -v
```

Rules:

1. Preserve existing user changes.
2. Never force push or rewrite remote history.
3. Never use destructive Git commands without explicit approval.
4. Never commit secrets, `.env` credentials, `node_modules`, `dist` or debug files.
5. Keep the working tree clean after completing a task.
6. Push stable commits to `origin/main`.
7. Do not replace or remove `origin` without inspecting it.
8. Do not create duplicate GitHub repositories.
9. Do not amend commits that are already pushed.
10. Do not combine unrelated changes. Review the diff before committing.

## Commit rules

Every commit must be one line, in English, Conventional, semantic, incremental, focused,
imperative, without emojis and without a final period.

Format: `type(scope): concise description`

Allowed types: `chore feat fix refactor style test docs build ci perf revert`

Do not commit a state broken by the current change (type check, lint, tests or build).

## Content architecture rules

The project grows through data, files and scripts — never by editing a presentation
component. Before writing code to publish content, check whether one of these paths
already covers it.

1. Production sports data must not be hardcoded in presentation components.
2. New championships are discovered from the documented Google Sheets contract. Adding one
   never requires a card, a carousel entry, a component or an override.
3. Championship media is added through `content/incoming/championships/{f8,f5}/{slug}/` and
   `npm run championships:assets`. Never register an asset import by hand.
4. Goals are added through `content/incoming/goals/{f8,f5}/` and the upload scripts.
5. Components consume normalized domain entities. They must not know Google Sheets columns,
   physical file names, folder paths, numeric prefixes, parsing rules or raw API responses.
6. Never map entities by array index, column position or visual order. Use stable ids:
   `{format}-{slug}` for a championship, `{format}-{short content hash}` for a goal.
7. Never use fuzzy matching to merge production entities. Aliases and overrides are explicit;
   approximate matching exists only for visitor-facing search.
8. Generated manifests are never edited by hand, and generated output is deterministic: two
   runs with no changes must leave the files byte-identical.
9. Missing media falls back to an accessible placeholder that reserves the layout space. Never
   borrow another championship's photo or another tournament's logo.
10. Tests must not depend on current production counts or on the names of the championships
    that happen to exist today. Use controlled fixtures and domain invariants; derive any
    production-dependent expectation from the snapshot.
11. Do not create an abstraction without a concrete reuse case — two real consumers minimum.
12. Never expose Cloudinary credentials, never commit local goal videos, and never make live
    Google Sheets or Cloudinary access mandatory for the normal build.

## Fundamental architecture rules

1. Do not add a backend without an explicit request.
2. Do not invent sports content (players, results, championships, stats, goals, news).
3. Do not use emojis. Use Lucide React or accessible SVG. Decorative icons use `aria-hidden`.
4. Do not hardcode colors outside `src/styles/tokens/colors.css` and `theme.css`.
5. Do not hardcode the team name outside `src/config/site.config.ts`.
6. Design mobile first and always verify desktop and mobile.
7. Use strict TypeScript. Never use `any` or `as any`.
8. Do not disable lint rules to hide problems.
9. Do not add dependencies without a clear reason. Do not duplicate components.
10. Preserve keyboard accessibility and respect `prefers-reduced-motion`.
11. Dynamically load heavy libraries (lightbox, ECharts).
12. Run validation before finishing. Keep user-facing copy in Spanish.

## Design tokens and styling

- Colors: literal values live only in `src/styles/tokens/colors.css` (palette) and
  `theme.css` (semantic aliases). Everything else uses semantic tokens.
- Tailwind utilities for semantic colors are registered via `@theme inline` in
  `src/styles/globals.css` (`bg-canvas`, `bg-surface`, `text-primary`, `text-secondary`,
  `border-line`, `bg-brand`, `text-brand`, `text-on-brand`, `bg-success`, etc.).
- Do not use arbitrary hex utilities (`bg-[#...]`, `text-[#...]`). Referencing a token via
  `bg-(--var)` or `[color-mix(... var(--token) ...)]` is allowed for dynamic theming.
- Inline styles are only for CSS custom properties or runtime-calculated dimensions.
- Component variants use Class Variance Authority; compose classes with `cn()`.

## Component policy

Before creating a component, search for an existing equivalent. Shared components must be
typed, configurable, accessible, responsive, token-based and independent of section content.
Use semantic props (`size`, `variant`, `tone`, `radius`, `surface`, `spacing`). Do not accept
raw hex colors as props. Do not make every card clickable. Require accessible names on
icon-only buttons.

Implemented primitives live in `src/components`. Not-yet-implemented components are
documented in the `README.md` of their folder (`media`, `data-display`, `navigation`).
Implement them with dynamic imports when a page renders them. A component with no
consumer is deleted, not kept as a placeholder: the README records the intent.

## Responsive and accessibility policy

- Verify at least 320, 375, 390, 768, 1024 and 1440 px: overflow, wrapping, navigation,
  touch targets, focus visibility, safe areas.
- Target WCAG AA. Use semantic HTML before ARIA. One `h1` per page. Keep the skip link and
  visible focus. Everything must work with mouse, keyboard, touch, screen reader, reduced
  motion and browser zoom.
- `ScrollRestoration` (in `RootLayout`) restores the scroll position on every history entry,
  which **cancels the browser jump to a `#fragment`**. Chromium usually wins the race, Firefox
  and WebKit do not. An in-page anchor must therefore scroll and focus its target explicitly
  (`WomenAndMixedPage` shows the pattern: `preventDefault`, `history.replaceState`,
  `scrollIntoView`, then `focus({ preventScroll: true })` on a `tabIndex={-1}` section).
  The chapter index of `/historia` still relies on the native behaviour and scrolls
  unreliably outside Chromium; fix it the same way when that page is touched.
- Pointer-driven effects (crest tilt) must never be the only way to reach content, because
  touch devices have no hover. Guard them with `(hover: hover)` when testing.

## Comment policy

Do not add comments that restate the code. No line-by-line narration, no explanation of a
clear name, no commented-out code, no context-free TODO.

Keep a comment only when it records something the code cannot show: a non-obvious decision,
an external constraint, a browser incompatibility, a spreadsheet exception, a security
decision, a Cloudinary limitation or a business rule that is not deducible. Keep it short.

Docstrings on exported functions, components and modules are the documented style and stay:
they describe the contract, not the implementation.

## TypeScript and React policy

- Keep `strict: true` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` and the
  other flags in `tsconfig.app.json`. Never use `any`; prefer `unknown` and validate it.
- Use `import type`, `satisfies`, discriminated unions and `as const`. Avoid enums.
- Function components only. Respect the Rules of Hooks. Avoid unnecessary effects and
  derived state. Keep state local. Do not add a global state library.

## Animation and multimedia policy

- Use Motion. Every animation must have a purpose, be brief, respect reduced motion and
  prefer `transform` and `opacity`. `MotionConfig reducedMotion="user"` is set at the root.
- Images require dimensions, alt text and an appropriate loading strategy.
- Videos must never autoplay audio and must load dynamically.
- 3D scenes are optional, load dynamically, have a fallback and never block navigation.

## Configuration points

- Team name, description, social links (Instagram is set), theme color, OG image:
  `src/config/site.config.ts`.
- Production URL: `VITE_SITE_URL` environment variable (see `README.md`), read by `site.config.ts`.
- Navigation items (label + path + Lucide icon): `src/config/navigation.config.ts`.
- Design tokens: `src/styles/tokens/*`. Routes: `src/constants/routes.ts`. Router: `src/app/routes.tsx`.
- Football format (`FootballFormat`, guard, labels): `src/config/football-format.ts`. It is the
  only declaration of the F8/F5 union — features alias it (`GoalFormat`) but never redeclare it.
- Query parameter names and their typed read/write helpers: `src/config/query-params.ts`.
  `modalidad` is written only for F5, so an F8 URL stays canonical.
- Content data: `src/data/crests.ts`, `kits.ts`, `history.ts` (chapters + photos), `brand.ts`
  (flag, current crest, header logo), `womenAndMixed.ts` (Cambalache and Cambalares media).
  Editorial domain types: `src/types/*`. Sports domain types live in their feature
  (`features/championships/types`, `features/goals/types`, `features/statistics/types`).
- Home sections: `src/features/home/HomeIntro.tsx`; brand components in `src/components/brand/*`
  (`InteractiveCrest`, `CrestFusion`, `TeamFlag`, `CrestTimeline`, `KitGallery`).
- History sections: `src/features/history/*` (chapter, timeline).
- Women and Mixed sections: `src/features/womenAndMixed/*` (Cambalache, Cambalares).

## Solares content and media

- Optimized media lives in `src/assets/solares/{brand,crests,kits,history,cambalache,cambalares}`
  as PNG/JPG + WebP pairs, rendered through `Picture` (`<picture>` with a WebP source and a fallback, plus intrinsic
  `width`/`height`). The raw source images are in `archivos_solares/` (gitignored — originals kept
  locally, never committed); the Femenino y Mixto sources are in `nuevos_archvios_fem_y_mixto/`
  (also gitignored) and are prepared by `npm run assets:women-and-mixed`. Every asset script is
  idempotent and skips existing targets: pass `--force` (or delete the target files) to
  regenerate after changing a source or a mapping.
- Crests, kits and photos are ordered chronologically in their data files. Crests: `crest-1`
  (oldest) … `crest-5` (`isCurrent`, the shield with laurels used in the flag). Kits: 10, chronological.
  History photos: `photo-0`..`photo-10`, placed in specific chapters — keep those positions. The
  Historia renaissance chapter contains four ordered images: the two original ones (`photo-3`,
  `photo-4`) always come before the two newer ones (`photo-9`, `photo-10`). Do not reorder
  editorial images for visual convenience.
- Photo blocks are rendered by the shared `EditorialGallery` (ordered photos, one or two columns,
  optional crop, optional lightbox, lazy loading). Do not add a per-section gallery component.
- Crest and logo images are **transparent PNGs**. They were cut with ImageMagick using
  connectivity-based flood fill from the corners (`-fill none -floodfill +x+y <bgcolor>`), which
  removes the background while preserving interior design (e.g. the bull's white horns, digit
  counters). When adding/replacing a crest, redo the same and **verify the result visually** before
  committing (view it on a mid-gray background to check the cut). Do not simplify or recolor crests.
- The crest timeline (`CrestTimeline`) shows crests transparent, without a plaque, at a uniform
  square size. `InteractiveCrest` is a hover-driven 3D spin (transparent crest + shadow, reduced
  motion → static). Its `shape="square"` frame needs an **explicit width** (`w-[13rem]`, not
  `w-full max-w-[13rem]`) and the `<picture>` needs a definite height, otherwise the box derives
  its size from the loaded image: it measures zero until the PNG arrives, which shifts the layout
  and makes size assertions flaky. `zoom` is an optical correction for artwork whose decorations
  (the Solares laurels and stars) shrink the body of the crest inside a shared frame.
- `LocationMap` embeds Google Maps via `output=embed` (no API key) with an external link.
  Instagram is an icon-only link rendered by the shared `TeamInstagram` block (custom
  `InstagramIcon` SVG, because Lucide v1 has no brand icons); Solares, Cambalache and Cambalares
  all use it.
- Favicon and the header logo come from the circular bull `icon` as transparent PNGs
  (`public/favicon*.png`, `.ico`, `apple-touch-icon`, `icon-192/512`; `src/assets/solares/brand/icon.png`).

## Women and Mixed (Cambalache and Cambalares)

The Femenino y Mixto page (`/femenino-mixto`) tells two related but separate stories.

- The page contains separate Cambalache (`#femenino`) and Cambalares (`#mixto`) sections.
  Cambalache represents the women-related section and Cambalares the mixed-team section.
  Do not mix Cambalache and Cambalares media.
- Solares has no women's team of its own. Cambalache is a different team; never present it as a
  Solares branch, and never add names, tournaments or results that are not already written.
- The Cambalache crest is extracted from the center of its flag. The extracted crest must
  preserve all internal colors, borders, text and shapes. The Cambalares crest is a faithful
  extraction of its source image. Never use automatic background removal on team crests:
  `scripts/prepare-women-and-mixed-assets.ts` only clears the outer background with a
  connectivity flood fill seeded from the image border, and every result is checked visually
  on a mid-gray background before committing. Original source files stay unchanged.
- Interactive crest behavior is shared: `InteractiveCrest` serves Solares, Cambalache and
  Cambalares through `size`, `shape`, `intensity`, `zoom` and `priority` props. Do not write a
  second implementation. Crest animation and the `CrestFusion` entrance must respect reduced motion,
  which renders the composition static.
- The `Cambalache + Solares = Cambalares` composition keeps an accessible name on the group, the
  plus and equals signs are `aria-hidden`, and it reflows vertically on small viewports. The three
  crests share one square frame of the same size; only the optical `zoom` differs between them.
- Photo order is defined by the descriptive source filenames and by the page requirements, never
  by file timestamps or by visual convenience. `src/data/womenAndMixed.ts` is the single ordered
  manifest; components never index media by magic numbers.

## Championships (F8 and F5)

The Championships page contains two football formats: F8 and F5. See
`docs/championships-data-source.md` for the full data contract.

- F8 is always the default format for `/campeonatos`. The active format is stored in the
  `modalidad` query parameter (only written for F5; `/campeonatos` is canonical F8). The
  selected championship is stored in the `torneo` query parameter (its slug).
- Never mix F8 and F5 championships, matches, scorers, assets, videos or statistics.
- Every championship has an explicit `f8` or `f5` format, defined by which sheet the data
  lives in. Do not infer football formats through unsafe string matching.
- Google Sheets is the source of truth for championship data. The client revalidates the
  public spreadsheet whenever the page is loaded (`cache: 'no-store'`).
- The summary sheet defines **published** championships. A championship listed there is
  published (shown in Campeonatos, counted as a title). A championship present only in the
  matches sheet (e.g. `Verano 2026`) is kept as `published: false`: hidden from the Campeonatos
  section and excluded from titles and tournament counts, but its matches still feed the pooled
  statistics (goals, matches, streaks, etc.). Adding a summary row publishes a championship
  automatically, with no override required.
- A published championship stays visible even when its optional assets or data are incomplete;
  missing team photos and tournament logos use explicit accessible placeholders. Never assign
  media from another championship as a fallback.
- The local snapshot is only a first-render and offline fallback. The build must not depend on
  live Google Sheets access.
- Championship photos and logos are static build assets and require a new deployment after
  being added. Tournament logos must be available as PNG; conversion is format-only and
  preserves every part of the original design (no automatic background removal).
- Videos must be unmounted when changing format or championship; never autoplay.
- In the spotlight the tournament logo sits **before** the championship name (`size="lg"`, larger
  than the `size="md"` used in the selector) and the team photo opens full size in the lightbox.
  Team photos are always contained, never cropped, so faces are preserved.

## Statistics (F8 and F5)

The Estadísticas page (`/estadisticas`) consumes the shared normalized football dataset from
the Championships feature — there is no second Google Sheets integration.

- The Statistics page has ONLY two scopes, F8 and F5, defaulting to F8 (`?modalidad=f5` for
  F5). There is NO combined "General" view: F8 and F5 are different sports and their
  statistics are never mixed or summed.
- Every statistic is derived from the normalized championships, matches and scorers via pure
  selectors in `src/features/statistics/selectors`. Do not compute statistics inside
  presentation components.
- Pooled match statistics (goals, matches, streaks, opponents, venues, kickoff times, records,
  clean sheets, scorers, annual) include ALL championships, even unpublished match-only
  editions. Tournament counts, titles and the per-tournament comparison use only published
  championships.
- Pending, cancelled and invalid matches do not count as played. Penalty shootout goals do not
  count toward GF or GC. Tournament honors represent the final achieved stage and are counted
  once; a title with an unknown tier is not classified as gold.
- Player, opponent and venue aliases are explicit (`src/features/statistics/data/*-aliases.ts`).
  Never merge entities through fuzzy matching. Historical scorer rankings use competitive
  (deterministic) tie handling.
- Knockout goals use match-level scorer attribution (available because scorers are stored per
  match). Do not estimate knockout goals from tournament totals. Rate rankings require the
  documented minimum sample (`MIN_MATCHES_FOR_RATE_RANKING`).
- Charts use Apache ECharts (dynamically imported, SVG renderer) and always include an
  accessible textual/tabular alternative. Chart colors come from `--color-chart-*` design
  tokens resolved via `useChartThemeTokens`; never hardcode chart colors. Do not use 3D charts.
- Championship honors are a podium: gold titles in the tall centre step, gold runner-ups and
  semifinals at the sides, and everything else (silver titles, silver runner-ups, quarterfinals)
  summarised in a note below. Gold and silver brackets are different competitions and are counted
  separately, never merged. There is no "other titles" bucket.
- Any per-championship list or chart is ordered by season, never alphabetically. Reuse
  `parseSeasonName` (`recency`: within a year Verano < Apertura < Clausura); undated names go last.
- Do not compute universal historical points; competitions use different point systems.
- New valid sheet data affects statistics automatically after revalidation. Default tests use
  the committed snapshot and fixtures, never the live spreadsheet.

## Goals (F8 and F5)

The Goles page plays short goal clips hosted on Cloudinary. See
`docs/goals-cloudinary-pipeline.md` for the full pipeline contract.

- The Goals section contains separate F8 and F5 collections. F8 is the default format for
  `/goles` (`?modalidad=f5` for F5). Never mix F8 and F5 goals.
- Local goal videos live under `Goles/` and must never be committed. The upload source is
  `Goles/web/`; the originals are never modified or deleted by any script.
- `CLOUDINARY_URL` must only be read from `.env.local` by local Node scripts. Never expose
  Cloudinary credentials to Vite or browser code, and never print keys, secrets or the URL.
  Under ESM the SDK needs `cloudinary.config(true)` because its import is evaluated before
  `dotenv` runs.
- The goals manifest may contain only public delivery information.
- Numeric filename prefixes and suffixes are not goal identifiers and must never be shown.
  Four-digit years that belong to a competition name must be preserved.
- Goal ordering uses competition chronology, not file timestamps: the source timestamps only
  record when the clips were copied to disk. Timestamps only break ties inside one competition.
- Goal ids are deterministic and content-based (`{format}-{short sha256}`). Do not upload
  duplicate video content. Hashing only catches byte-identical files: the same goal exported
  twice (different bitrate, burned-in watermark) hashes differently, so
  `npm run goals:duplicates` compares frames perceptually and reports candidates. It never
  deletes — choosing which copy to keep is a human decision.
- To remove a clip, mark it `skip` in the source overrides with a reason, re-inspect, then
  `npm run goals:prune`. Skipping without pruning leaves an unreferenced asset hosted; pruning
  without skipping means the next upload puts it straight back. Deletion never touches the
  local file, which is what makes it reversible.
- Goal metadata is classified before upload. Do not use fuzzy matching to silently merge
  scorers or competitions — Fuse.js is only for user-facing search.
- Friendly and preseason goals belong in the competition filter and only ever appear on the
  Goles page, never inside an official championship.
- Goal filters combine with AND, and each one is scoped by the other: the tournament options are
  counted within the selected scorer and vice versa, including the `Todos` row. A filter must never
  offer an option that would produce an empty result, and no count may ignore the active filter.
- Previous and next navigation stays inside the filtered collection, and both ends are closed
  rather than circular.
- Shared goal URLs open the player on the selected goal and always point at `/goles`, even when
  the player was opened from a championship. A filter that would hide a shared goal is dropped;
  the goal is not.
- `GoalGallery` and `GoalPlayer` are reusable. Championship pages omit the goals section
  entirely when no matching goal exists — no heading, no placeholder. Goals are matched by
  format plus `championshipId`, never by display name.
- The normal build must not require `CLOUDINARY_URL` or Cloudinary access. Uploads are
  resumable at file level and never overwrite an existing asset.
- Cards render static posters only: no `<video>` in the grid and no hover playback. The 4:3
  poster crop is a grid device; the player always shows the original aspect ratio.
- The goal player starts playing as soon as the clip is ready. This is a deliberate exception
  to the general "no autoplay" rule, confirmed by the club: opening a goal is an explicit click,
  so the browser allows sound, and a clip lasting a few seconds is the whole point of the page.
  A browser that refuses to start without a gesture (a shared link opened directly) leaves the
  clip paused — that is not a playback failure and must never surface an error.
- Clip duration comes from the manifest until the element reports its own, and is only accepted
  once it is finite and positive: a transcoded MP4 reports `Infinity` first. Read it on
  `loadedmetadata` and `durationchange`, and also on mount, because a cached clip can already
  have its metadata before the listeners are attached.

## Known accepted lint warnings

`react-refresh/only-export-components` warns on files that export a component together with
its CVA variant function (idiomatic co-location) and on `routes.tsx`. These are development
hot-reload hints only; `npm run validate` passes (0 errors). The rule stays enabled and
visible; do not disable it globally.

## Known flaky end-to-end tests

These specs fail intermittently inside the full parallel run and pass when run alone. Do not
treat them as a regression and do not "fix" them by loosening an assertion.

- Firefox, Championships: `reveals a match goalscorers on interaction` and `reveals all
matches on demand`. They predate the current work (verified by stashing local changes).
- WebKit, Femenino y Mixto: `the crests answer to the pointer with a bounded rotation`. It
  reads a Motion transform right after a pointer move, which WebKit does not always have
  committed yet under parallel load.
- WebKit, responsive: `has no horizontal overflow at 375px`, occasionally, under load.

Re-run the failing spec in isolation
(`npx playwright test --project=<browser> <file> -g "<title>"`) and report the result
honestly. Any _other_ failure is a real one.

## Writing Playwright specs here

- `locator.evaluateAll()` does **not** auto-wait. On a lazily rendered route it silently returns
  `[]`. Await an `expect()` or `locator.waitFor()` on the element first, then read the DOM.
- Lazy images have `naturalWidth === 0` until they load, so aspect-ratio or size assertions must
  poll (`await expect.poll(...)`) instead of measuring immediately.
- Skip pointer/hover tests on the touch projects (`mobile-small`, `mobile-medium`, `tablet`)
  with `test.skip(!canHover, ...)` after reading `matchMedia('(hover: hover)')`.
- Tailwind utilities such as `[perspective:1100px]` are **classes**, not inline styles. Match
  them with `[class*="perspective"]`; `[style*="..."]` finds only what Motion writes inline.
- The six projects are Chromium, Firefox, WebKit, two phones and a tablet. A layout or scroll
  behaviour that works in Chromium is not proof; run the spec across projects before claiming it.

## Validation commands

```bash
npm run format:check
npm run typecheck
npm run lint
npm run test:run
npm run build
```

For navigation, layout or responsive changes also run:

```bash
npx playwright install
npm run test:e2e
```

`npm run validate` runs format:check, typecheck, lint, unit tests and build together. It needs
no credential and no network. Do not claim a check passed unless it was actually executed
successfully.

Content commands (see `docs/content-operations.md`):

```bash
npm run content:check    # manifests + local clip classification, no credential
npm run content:sync     # snapshot + assets + goal upload, needs CLOUDINARY_URL
```

## Deployment

Static SPA. Fallback rewrites to `index.html` are configured in `vercel.json` and
`netlify.toml`. For GitHub Pages set Vite `base` to the repository path and add an SPA
fallback; prefer clean URLs with rewrites over `HashRouter`. Do not hardcode an unconfirmed
domain.

## Completion report

At the end of a task report: what was added and changed, which components were reused, which
routes were affected, which validation commands were run, which commits were created and
pushed, remaining limitations and the main files for continuing the work. Do not paste
complete source files unless explicitly requested.
