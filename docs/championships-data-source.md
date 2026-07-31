# Championships data source

The Championships page (`/campeonatos`) is driven entirely by a public Google
Sheet. There is no backend: the browser reads the sheet directly through the
public Google Visualization endpoint, validates it and renders it. This document
is the contract for keeping that integration working.

## Spreadsheet

- **Spreadsheet ID:** `1SDQgD6adhje5JFokdqNmGQYA0VQrqBKeWOvtAcI53bo`
- **Public URL:** <https://docs.google.com/spreadsheets/d/1SDQgD6adhje5JFokdqNmGQYA0VQrqBKeWOvtAcI53bo/edit>
- **Read endpoint (per sheet):**
  `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?gid={GID}&tqx=out:json`

No credentials, API key, OAuth or token is used. The spreadsheet ID and gids are
public and live in `src/config/championships-source.config.ts`.

## Sheets

The spreadsheet has four sheets. Two hold the championship summary (one per
football format) and two hold the matches (one per format). **The football
format is defined by which sheet a row lives in — never by string matching on
names.**

| Purpose       | Football format | gid          | Header row        | Key columns                                                                                  |
| ------------- | --------------- | ------------ | ----------------- | -------------------------------------------------------------------------------------------- |
| Championships | F8              | `1515588434` | first row of data | Campeonato, Torneo, Resultado, Link Final                                                    |
| Matches       | F8              | `427464350`  | column labels     | Rival, Resultado, Goles a favor, Goles encontra, Sede, Torneo, Fase, Goleadores, Fecha, Hora |
| Championships | F5              | `1191761422` | first row of data | Campeonato, Torneo, Resultado, Link Final                                                    |
| Matches       | F5              | `880695400`  | column labels     | Rival, Resultado, Goles a favor, Goles encontra, Sede, Torneo, Fase, Goleadores, Fecha, Hora |

Note the header difference: gviz auto-detects headers on the matches sheets
(they carry column labels), but the summary sheets return generic `A/B/C/D`
labels, so their first data row is the header. This is encoded per sheet as
`headerInColumns` in the config and handled by `readSheetTable`.

## Column meaning

### Summary sheets (championships)

- **Campeonato** — the championship name, e.g. `Apertura 2022`, `Clausura 2025`,
  `Apertura 2026`. This is the join key to the matches sheet.
- **Torneo** — the league/organizer, e.g. `Torneos Indiana`, `TdeA`, `DePrimera`.
  This resolves the tournament logo (logos are per league, shared).
- **Resultado** — the final standing (see "Result and trophy mapping").
- **Link Final** — a YouTube URL for the final, or empty, or a non-URL title
  (which is ignored).

### Matches sheets

- **Torneo** — here this column is the **championship name** (same values as
  `Campeonato` in the summary), not the league.
- **Resultado** — `Victoria` / `Empate` / `Derrota`.
- **Goles a favor / Goles encontra** — numeric goals for and against.
- **Sede** — venue.
- **Fase** — `Regular`, `Octavos`, `Cuartos`, `Semifinal`, `Final`.
- **Goleadores** — comma-separated player names, one entry per goal. `En Contra`
  marks an own goal: it counts toward goals for but is not a player.
- **Fecha** — a date; gviz returns it as `Date(YYYY,M,D)` with a zero-indexed
  month. The formatted `d/m/yyyy` fallback is also supported.
- **Hora** — kick-off time (not used).

## Football format mapping

- **F8** = summary gid `1515588434` + matches gid `427464350`.
- **F5** = summary gid `1191761422` + matches gid `880695400`.

A championship name can appear in both formats (e.g. `Clausura 2025` exists in
both). They are different tournaments, so identifiers are namespaced by format:
`f8-clausura-2025` and `f5-clausura-2025`. Slugs are deterministic
(`slugify(name)`), never random.

## Dynamic championship discovery

The summary sheet defines **published** championships. Adding a row to a summary
sheet publishes a championship automatically — no code change, no override. Its
matches, scorers and statistics are read from the matches sheet by name.

A championship present only in the matches sheet (not in the summary) is kept as
`published: false`. For example an in-progress `Verano 2026` in the F5 matches
sheet is **not shown in the Campeonatos section and does not count as a title or
a tournament**, but its matches still feed the pooled statistics on the
Estadísticas page (goals, matches, streaks, opponents, etc.). It becomes a full
published championship once added to the summary sheet.

### Required structure for a new championship

To publish a new championship, add a row to the correct summary sheet with:

- **Campeonato** (required) — the display name; include the year (e.g.
  `Apertura 2027`). This becomes the id/slug and drives ordering.
- **Torneo** (optional) — the league, to resolve a shared logo.
- **Resultado** (optional) — the final standing; omit while the tournament is
  in progress.
- **Link Final** (optional) — the final's YouTube URL.

Then, in the matches sheet of the same format, use the exact same name in the
`Torneo` column for every match of that championship.

Optional (`src/features/championships/data/championship-overrides.ts`): a short
name, visual order, forced trophy tier, focal position, video override or an
alias for an alternative spelling. Overrides are never required for a
championship to appear.

## Result and trophy mapping

`Resultado` maps to a distinction and trophy tier (editorial convention,
confirmed with the club). The "Plata" (silver) bracket is always explicit, so an
unqualified `Campeón` / `Finalista` belongs to the gold bracket.

| Resultado            | Honor                     | Trophy |
| -------------------- | ------------------------- | ------ |
| `Campeón`            | Campeón de Oro            | gold   |
| `Campeón Plata`      | Campeón de Plata          | silver |
| `Finalista`          | Subcampeón                | none   |
| `Finalista de Plata` | Subcampeón de Plata       | none   |
| `Semifinalista`      | Semifinalista             | none   |
| (empty)              | Resultado final pendiente | none   |

`Semifinalista` contains the substring `finalista`, so it is matched before the
finalist rule (`src/features/championships/utils/mapChampionshipHonor.ts`).

## Statistics

Per championship: `played`, `won`, `drawn`, `lost`, `goalsFor`, `goalsAgainst`,
`goalDifference`. Only matches with a decided outcome and numeric goals are
counted, so `played === won + drawn + lost` and
`goalDifference === goalsFor - goalsAgainst`. Pending, cancelled or unreadable
matches are excluded. Statistics are computed per championship and are never
combined across formats.

## Dates and scores

- Dates are parsed explicitly from `Date(YYYY,M,D)` (month zero-indexed) or
  `d/m/yyyy`. Ambiguous dates are not guessed; an unparseable date is left
  empty and the match keeps a stable source order.
- Scores come from `Goles a favor` / `Goles encontra`. There is currently no
  penalty-shootout notation in the data; the model tolerates it defensively but
  no penalty UI is invented. Own goals (`En Contra`) count toward goals for but
  are excluded from scorer tallies.

## YouTube links

Recognized: `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/embed/`,
`youtube.com/shorts/` and a bare 11-character id. A non-URL value (for example a
plain video title) yields no video and the final section is omitted. Videos are
embedded via `youtube-nocookie.com`, click-to-load, never autoplayed.

## Known inconsistencies

- `Clausura 2025` and `Apertura 2026` exist in both F8 and F5 — handled by
  format-namespaced ids. They are different tournaments with their own matches,
  team photos and statistics.
- The F5 summary's `Apertura 2026` `Link Final` is a plain title, not a URL, so
  no video is shown for it.
- `Verano 2026` exists in the F5 matches sheet but not the F5 summary, so it is
  unpublished: hidden from Campeonatos and excluded from titles, but its matches
  count in the pooled statistics.

## Fallback rules

- Missing team photo → an accessible placeholder in the same frame ("Foto del
  plantel todavía no disponible"). No other championship's photo is used.
- Missing tournament logo → an initials placeholder ("Logo del torneo todavía no
  disponible").
- Missing matches → "Todavía no hay partidos cargados para este campeonato" and
  zeroed statistics.
- Missing scorers → "Todavía no hay goleadores registrados".
- Missing video → the final section is omitted.

## Asset limitations

Google Sheets data updates without a redeploy. Photos and logos are **static
build assets** committed under `src/assets/solares/championships/`. A new
championship appears from the sheet immediately, but its photo and logo only
appear after they are added to the repository and the site is **rebuilt and
redeployed**. Missing assets never hide a championship — placeholders are used.

Sources of raw images live in `campeonatos_archivos_solares/` (gitignored). The
optimized assets are produced by:

- `npm run assets:championship-logos` — converts league logos to PNG
  (format-only; preserves the full design, no background removal). See
  `scripts/convert-championship-logos.ts`.
- `npm run assets:championship-photos` — writes optimized JPG + WebP team photos
  at their original dimensions. See `scripts/prepare-championship-photos.ts`.

To add media for a new championship: place the source image in
`campeonatos_archivos_solares/`, add a mapping entry in the relevant script, run
the script, register the import in
`src/features/championships/data/championship-assets.ts`, then rebuild and
redeploy.

## Update procedure

The client revalidates the spreadsheet on every visit to `/campeonatos` (mount,
reload or return navigation) using `fetch(..., { cache: 'no-store' })` with a
`_ts` cache-buster and an `AbortController`. The committed snapshot
(`src/features/championships/data/generated/championships.snapshot.json`) renders
first and serves as an offline fallback; a valid remote response replaces it. A
failed or invalid remote response never overwrites the visible data.

Refresh the snapshot with `npm run sync:championships` (and
`npm run sync:championships:check` in CI to detect staleness). The snapshot is a
first-render/offline convenience only — the build never requires live Google
Sheets access, and new championships still arrive through the runtime fetch.
