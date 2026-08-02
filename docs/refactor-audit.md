# Repository architecture audit

Baseline commit: `74a6d2f`. Every observation below points at a real file in this
repository. No secrets, no file contents are reproduced.

## Summary

The application already satisfies most of the "grow through data, not through
components" goal. Championships are discovered dynamically from Google Sheets,
identifiers are format-namespaced and deterministic, goals carry content-derived
ids, both features render from validated generated data, and missing assets fall
back instead of hiding content.

The gap is concentrated in **one place**: championship media. That is the only
content type that still requires editing TypeScript to publish. Everything else
in this audit is cleanup — dead scaffolding, duplicated presentation code and
inconsistent script naming.

## Current architecture

| Layer            | Location                                                        | State                                                    |
| ---------------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| Remote source    | `src/features/championships/api/`                                | Google Sheets gviz, no credentials, `cache: 'no-store'`   |
| Normalization    | `src/features/championships/mappers/`, `utils/`                  | Pure, unit tested                                        |
| Offline fallback | `src/features/championships/data/generated/championships.snapshot.json` | Committed, refreshed by script                     |
| Derived stats    | `src/features/statistics/selectors/`                             | Pure selectors over the same normalized model             |
| Goals            | `src/features/goals/data/generated/goals.manifest.json`          | Committed, Zod-validated entry by entry                   |
| Goals pipeline   | `scripts/goals/`, `scripts/inspect-goals.ts`, `scripts/upload-goals-to-cloudinary.ts` | Hash ids, checkpoint, dry run       |

Statistics consumes the championships model directly, so there is a single
interpretation of a championship. That part of the target architecture is done.

## Blocking problem: championship media requires code edits

Publishing a team photo or a tournament logo today takes three coordinated edits:

1. `scripts/prepare-championship-photos.ts` — append an entry to the hardcoded
   `PHOTOS` array, mapping an arbitrary source filename
   (`Clausura_2025_F5.jpeg`) to a format and slug.
2. `scripts/convert-championship-logos.ts` — append an entry to the hardcoded
   `LOGOS` array.
3. `src/features/championships/data/championship-assets.ts` — add two static
   imports and a record entry with **hand-measured** `width`/`height`.

`championship-assets.ts` is 74 lines of which 25 are imports and 22 are a literal
map keyed by championship id. Its intrinsic dimensions are transcribed by hand
from the script's console output, so they can silently drift from the encoded
file. This single file is the reason the central principle is not yet met.

Related consequences:

- Source images live in `campeonatos_archivos_solares/` with free-form names, so
  the script's job list is the only thing binding a file to a championship.
- Nothing validates a slug against the championships actually present in the
  spreadsheet. A typo produces a silently unreferenced asset.
- The photo crop for `Clausura 2024` is expressed as pixel coordinates inside the
  script rather than as editorial configuration.

## Duplicated presentation code

Three components are structurally identical F8/F5 Radix tab switchers with the
same `TRIGGER` class string duplicated verbatim:

- `src/features/championships/components/ChampionshipFormatTabs.tsx`
- `src/features/statistics/components/StatisticsScopeTabs.tsx`
- `src/features/goals/components/GoalFormatTabs/GoalFormatTabs.tsx`

Each declares its own `TABS` literal and its own format guard. Three consumers of
one behaviour is real duplication, not a coincidence.

## Duplicated domain types

`FootballFormat` is declared in `src/config/championships-source.config.ts`.
`GoalFormat` is an identical union declared in `src/features/goals/types/goals.ts`,
with its own `GOAL_FORMATS` list and a local `isGoalFormat` guard duplicating
`isFootballFormat`. The goals feature and the championships feature therefore
carry two names for the same domain concept.

## Dead scaffolding

An unused parallel domain layer predates the real features and duplicates their
concepts:

| File                                                          | Consumers |
| ------------------------------------------------------------- | --------- |
| `src/data/competitions.ts`, `goals.ts`, `matches.ts`, `players.ts`, `team.ts` | 0 (empty typed arrays) |
| `src/types/competition.ts`, `goal.ts`, `match.ts`, `player.ts`, `team.ts`     | 1 each — only the empty stub above |
| `src/schemas/competition.schema.ts`, `goal.schema.ts`, `match.schema.ts`, `player.schema.ts`, `team.schema.ts` | 0 |

Unused components and modules:

| File                                                    | Consumers |
| -------------------------------------------------------- | --------- |
| `src/components/three/LazyThreeScene/`                   | 0         |
| `src/components/three/ThreeFallback/`                    | 1 — only `LazyThreeScene` |
| `src/components/media/ResponsiveImage/`                  | 0         |
| `src/components/primitives/Skeleton/`, `Divider/`, `Card/` | 0       |
| `src/lib/storage.ts`, `src/lib/formatters.ts`            | 0         |
| `src/hooks/useScrollLock.ts`, `src/hooks/useDocumentTitle.ts` | 0    |

## Unused dependencies

Verified by searching `src/`, `scripts/` and `tests/` for imports:

- `@react-three/drei`, `@react-three/fiber`, `three`, `@types/three` — no import
  anywhere. `LazyThreeScene` is a generic loader that is never handed a scene.
- `react-player` — no import. `GoalPlayer` uses a native `<video>` element and
  `FinalVideo` uses a YouTube iframe.

`p-limit`, `sharp`, `cloudinary` and `dotenv` are used only by `scripts/` and
must be kept.

## Repeated values

`'modalidad'` is declared independently in four files
(`useChampionshipsUrlState.ts`, `buildGoalShareUrl.ts`, `championshipUrl.ts`,
`useStatisticsScope.ts`); `'torneo'` in three. Each page re-implements the same
parse/serialize/fallback logic against the same parameter names.

## Missing operational pieces

- `.env.example` does not exist, although `.gitignore` explicitly un-ignores it
  (`!.env.example`) and `docs/goals-cloudinary-pipeline.md` states it documents
  the credential shape.
- There is no `validate` script. `check` exists but omits `format:check`.
- Script names are inconsistent: `sync:championships` and
  `assets:championship-logos`/`assets:championship-photos` versus the
  feature-first `goals:*` family.
- There is no `goals:verify` and no unified `content:check` / `content:sync`.
- The goals intake folder (`Goles/web/`) is not discoverable from the repository
  and has no README for a non-technical operator.

## Goals file naming

`scripts/goals/goal-file-parser.ts` matches `^([^-]+)-([^-]+)-(\d+)$`. The
pattern forbids hyphens inside a competition or scorer segment and requires a
numeric trailing index that is parsed only to be discarded. A new clip named with
a hyphenated competition cannot be classified without an override. The existing
collection matches this pattern, so the parser must stay, but new files need a
convention that does not encode meaning in a positional number.

## Tests

The unit suite is in good shape: `mapChampionships.test.ts`,
`selectStreaks.test.ts`, `goalSelectors.test.ts` and the rest build their own
fixtures. `src/features/goals/test/goalFixtures.ts` already exists.

Real fragility, all against production data rather than fixtures:

- `src/features/championships/components/ChampionshipsSection.test.tsx` asserts
  the heading `Apertura 2026` from the committed snapshot. Publishing any newer
  championship breaks it.
- `tests/e2e/championships.spec.ts` asserts `Apertura 2026` in five tests,
  `Clausura 2025` in two, and `Clausura 2023`'s absence from F5. Same failure
  mode.
- `tests/e2e/statistics.spec.ts` filters the scorers table by a real player name.

`tests/e2e/women-and-mixed.spec.ts` and `HistoryPage.test.tsx` also assert exact
counts, but those cover fixed editorial content, not growing sports data, so the
counts are the invariant and are correct as written.

Two Championships specs are known-flaky on Firefox under parallel load; that is
recorded in `CLAUDE.md` and is not addressed here.

## Migration risks

| Risk                                          | Mitigation                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| Moving `Goles/web/` invalidates upload state  | Keep `Goles/web/` working; add the new intake root as an additional, preferred location |
| Regenerating photos changes committed bytes   | Keep the existing encoder settings and skip targets that already exist       |
| Renaming npm scripts breaks the operator's habits | Update every document that names them in the same commit                 |
| Deleting `src/types/*` breaks an unseen import | Verified consumer counts first; typecheck and build gate each removal       |

## Proposed final architecture

Additive, not a rewrite:

- `src/config/football-format.ts` — one `FootballFormat`, one guard, one label
  map, consumed by championships, statistics and goals.
- `src/config/query-params.ts` — the parameter names and their typed
  parse/serialize helpers.
- `src/components/navigation/FormatTabs/` — one accessible switcher replacing the
  three duplicates.
- `content/incoming/championships/{f8,f5}/{slug}/` — slug-named intake folders
  validated against the normalized championships, plus a Spanish README.
- `scripts/championships/process-championship-assets.ts` — one idempotent script
  that discovers folders, validates slugs, encodes derivatives, measures
  dimensions and writes a generated manifest.
- `src/features/championships/data/generated/championship-assets.manifest.json`
  plus a generated TypeScript module resolving the static imports Vite needs.
- `content/incoming/goals/{f8,f5}/` — the documented intake root, with the
  canonical `competition__scorer__label.ext` convention parsed alongside the
  legacy pattern.
- `validate`, `content:check` and `content:sync` as the three commands an
  operator needs.
