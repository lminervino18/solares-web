# Goals media pipeline

The Goles page plays short goal clips hosted on Cloudinary. There is no backend:
local scripts classify and upload the clips, and the site reads a committed
manifest containing only public delivery data. This document is the contract for
keeping that pipeline working.

## Local source folder

Clips live outside the tree Git tracks. Two roots are supported:

```text
content/incoming/goals/     documented intake, preferred
├── f8/
└── f5/

Goles/web/                  original location, still read
├── F8/
└── F5/
```

`scripts/goals/goal-paths.ts` resolves one root per run: the intake folder once
it actually holds clips, otherwise the legacy one. Emptiness matters, not
existence — the intake folders are committed empty, and picking them while empty
would silently hide an existing collection. Reading a single root also means a
clip is never inspected twice under two source paths.

Either casing of the format folder (`f8` or `F8`) works. The format always comes
from the folder, never from the file name.

Because ids are content hashes, **moving a collection between the two roots
re-uploads nothing**: the same bytes keep the same id and the same public id.

Both roots are gitignored. The originals are never deleted, renamed, re-encoded
or modified by any script.

## Credentials

`.env.local` holds a single value:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

Rules:

- The file is gitignored (`.env.*` and `*.local`) and must never be committed.
- Only Node scripts read it, through `dotenv`. The browser never sees it.
- Never prefix it with `VITE_`: that would compile the API secret into the
  client bundle and publish it.
- Never print it, log it, or write it to a report, manifest or checkpoint.
- `.env.example` documents the shape with placeholders only.

Before uploading, verify:

```bash
git check-ignore -q .env.local          # must succeed
git ls-files --error-unmatch .env.local # must fail
```

If the file is tracked, stop, remove it from the index without deleting it, check
whether it reached a published commit, and rotate the credential before doing
anything else.

### ESM caveat

`import { v2 as cloudinary } from 'cloudinary'` is evaluated **before** the module
body runs, so the SDK initialises with an empty configuration and never sees the
variables `dotenv` loads afterwards. `scripts/upload-goals-to-cloudinary.ts`
therefore calls `cloudinary.config(true)` to force a re-read. Without it the
script reports `CLOUDINARY_URL is present but could not be parsed`.

## File naming and classification

Two conventions are parsed, in this order. Neither encodes a goal number.

### Canonical, for new clips

```text
{competition-slug}__{scorer-slug}__{label}.{ext}
```

For example `apertura-2026__lorenzo-minervino__gol-01.mp4`. Segments are
separated by a double underscore, so hyphens are free inside a competition or a
scorer name — which the legacy pattern forbids. Segments are lowercase slugs and
are title-cased back into display names; an alias then restores accents and
irregular spellings.

### Legacy, for the collection uploaded before the convention existed

```text
{Competition}_{Year}-{Scorer}-{index}.{ext}
```

For example `Apertura_2026-Lorenzo_Minervino-0.mp4`. Existing files are **not**
renamed: renaming them would churn nothing useful and the parser keeps reading
them.

Common to both:

- **The third segment is meaningless.** It only keeps sibling file names unique.
  It is not a goal number, a shirt number, a matchday or a date. It is parsed and
  discarded, and never shown in the interface.
- **Four-digit years are kept.** They are part of the competition name.
- The format comes from the folder (`f8` / `f5`), never from the name.
- `en-contra` (or legacy `En_Contra`) marks a goal scored by the opposing team.
  It keeps its video and is displayed as `En contra`, but it belongs to no
  player.

Names are resolved in this order: an explicit override, then the deterministic
parser, then a competition or scorer alias. Nothing is ever resolved by fuzzy
matching — approximate matching exists only to help a visitor search.

Aliases live in `src/features/goals/data/`:

- `goal-scorer-aliases.ts` — the local files are ASCII-only, so accented names
  lose their diacritics. `santiago penonori` maps back to `Santiago Peñoñori`.
- `goal-competition-aliases.ts` — empty while every file name matches the
  spreadsheet spelling. It also resolves the competition type: `Amistoso *` is
  `friendly`, `Pretemporada *` is `preseason`, `Apertura`/`Clausura` are
  `official`, anything else is `other`.

Ambiguous files go in `scripts/goals/goals-source-overrides.ts`, keyed by the path
relative to the goals root:

```ts
export const GOAL_SOURCE_OVERRIDES = {
  'F8/nombre-raro.mp4': { scorerName: 'Lorenzo Minervino', competitionName: 'Apertura 2026' },
}
```

Use an override only for a genuinely ambiguous name. A spelling that recurs
belongs in an alias instead.

## Goal identity

A goal id is derived from its content, never from its file name:

```text
{format}-{first 12 hex chars of the file's SHA-256}
```

This makes the id stable across renames, different between formats for identical
content, and different for different content. Duplicate clips are detected by
hash and uploaded once.

## Cloudinary layout

```text
solares/goals/{format}/{competition-slug}/{scorer-slug}-{short-hash}
```

For example
`solares/goals/f8/apertura-2026/santiago-penonori-a4d938b817fc`. Public ids are
lowercase, ASCII and URL-safe; accents survive only in the displayed metadata.

Each asset carries tags (`solares`, `goal`, the format, `competition:{slug}`,
`scorer:{slug}`, `type:{competitionType}`) and contextual metadata (goal id,
format, competition name/slug/type, scorer name/slug, source file name, source
timestamp, source hash). No absolute path and no credential is ever stored.

## Ordering

Source timestamps only record when the clips were copied to disk — every file in
this collection falls on one of three days in July 2026 — so they cannot order
goals that span four seasons. Ordering therefore comes from the competition:

1. Official competitions first, then friendlies, then preseason.
2. Inside each group, by year descending, then Clausura before Apertura.
3. Inside one competition, by source timestamp descending.
4. The stable goal id breaks any remaining tie.

This lives in `src/features/goals/utils/compareGoalCompetitions.ts` and is shared
by the manifest generator and the gallery, so both agree.

## Scripts

```bash
npm run goals:inspect      # classify local clips, write a report, upload nothing
npm run goals:upload:dry   # report exactly what would be uploaded
npm run goals:upload       # upload and rebuild the manifest
npm run goals:verify       # check every published goal is really hosted
npm run goals:sync         # inspect + upload + verify
npm run goals:duplicates   # report clips that look the same but hash differently
npm run goals:prune        # report hosted assets the collection no longer publishes
npm run goals:prune:apply  # delete them
```

`goals:inspect` writes `data/goals/goals-inspection.generated.json` (gitignored)
separating resolved, ambiguous, unresolved, duplicate and unsupported files, plus
per-competition and per-scorer counts. Paths in the report are relative, so it
never leaks a local path.

`goals:upload` reads that report. It uses `upload_large` with a 6 MB chunk size,
a concurrency of 2 (`GOALS_UPLOAD_CONCURRENCY` overrides it), three attempts with
exponential backoff, and `overwrite: false` so an existing asset is never
silently replaced. Authentication and permission failures are permanent and are
not retried.

None of these run during `npm install`, `npm run dev` or `npm run build`. **The
build never needs a credential or network access to Cloudinary.**

## Removing a goal

Content hashing only catches byte-identical files. The same goal exported twice
— a different bitrate, or a burned-in `@solares.futbol` watermark — produces
different bytes and is uploaded as two goals.

`npm run goals:duplicates` finds those. It reduces several frames per clip to a
perceptual fingerprint and compares clips credited to the same scorer in the
same competition and format, writing candidates to
`data/goals/goals-duplicates.generated.json`. It never deletes: judging which
copy to keep needs a human, and the comparison is a heuristic.

To remove a clip once decided:

1. Add it to `scripts/goals/goals-source-overrides.ts` with `skip: true` and a
   `reason`. Skipping rather than deleting the file keeps the decision visible
   and reversible.
2. `npm run goals:inspect` — the clip drops out of the resolved set.
3. `npm run goals:prune` to see which hosted assets are now unpublished, then
   `npm run goals:prune:apply` to delete them. The script only ever deletes
   assets absent from the inspection, and clears their checkpoint entries so a
   later upload does not believe they still exist.
4. `npm run goals:upload` to rebuild the manifest, then commit it.

Skipping without pruning leaves the asset hosted but unreferenced; pruning
without skipping means the next upload puts it straight back.

## Checkpoint and resuming

`.cache/goals-upload-state.json` (gitignored) records, per content hash, the
public id, status, attempt count, timestamp and the media facts returned by
Cloudinary. Re-running the upload skips completed files, retries failures and
picks up new ones; a file whose content changed gets a new hash and is uploaded
again.

Resuming is guaranteed **at file level**: a clip interrupted mid-transfer starts
over on the next run. The checkpoint never stores a credential, a signature or an
absolute path.

## Manifest

`src/features/goals/data/generated/goals.manifest.json` is committed and is the
only goals data the frontend reads. Each entry holds the goal id, format, scorer,
competition (with `championshipId` for official ones), the Cloudinary public id
and four public URLs, the media facts, and the source file name, timestamp and
hash.

It is validated at runtime with Zod (`schemas/goal-manifest.schema.ts`), entry by
entry, so one malformed goal is dropped instead of breaking the gallery.

### Posters

The clips mix orientations — 96 square, 78 landscape, 38 portrait — so no source
ratio suits them all. Cards use a single 4:3 frame with automatic gravity, which
is the balanced compromise for that mix and keeps the grid uniform. The player
always renders the untouched original ratio; the crop is a grid device only.

## Adding new goals

1. Drop the web-ready clips into `content/incoming/goals/f8` or
   `content/incoming/goals/f5`. Do not modify existing files.
2. `npm run goals:inspect` and read the report.
3. Resolve anything listed as ambiguous or unresolved with an alias or an
   override, then inspect again.
4. `npm run goals:upload:dry` and check the counts and public ids.
5. `npm run goals:upload`.
6. `npm run validate` and commit the regenerated manifest.
7. Deploy. Photos, logos and the manifest are build assets, so new goals only
   appear after a redeployment.

Adding goals never requires touching a component. A correct file name — or an
override when the name is ambiguous — is enough.

## What is committed

Committed: the scripts, the aliases, the overrides, the manifest, the feature
code and its tests.

Never committed: the clips under `Goles/`, `.env.local`, `.cache/`, and the
generated reports under `data/goals/`.
