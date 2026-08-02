# Solares Web

Official frontend website for Solares. Static SPA: no backend, no database, no
custom API. Sports data comes from a public Google Sheet at runtime; goal clips
are delivered by Cloudinary through a committed manifest.

## Stack

React 19, React Router 7, TypeScript 6, Vite 8, Tailwind CSS v4, Radix UI,
Motion, ECharts, Zod, Vitest, Playwright.

## Requirements

- Node.js 20.19+
- npm

## Setup

```bash
npm install
npm run dev
```

## Validation

```bash
npm run validate
```

Runs `format:check`, `typecheck`, `lint`, `test:run` and `build`. It needs no
credential and no network access.

End-to-end tests:

```bash
npx playwright install
npm run test:e2e
```

## Content workflows

New content is added through data, folders and scripts — never by editing a
component. Full instructions for the site administrator are in
[`docs/content-operations.md`](docs/content-operations.md).

| Task               | How                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| New championship   | Add a row to the Google Sheet. It appears on the next page load.                                        |
| Championship media | Drop files in `content/incoming/championships/{f8,f5}/{slug}/`, then run `npm run championships:assets` |
| New goals          | Drop clips in `content/incoming/goals/{f8,f5}/`, then run `npm run goals:sync`                          |

Content commands:

```bash
npm run content:check           # validate manifests and classify local clips (no credential)
npm run content:sync            # refresh snapshot, process media, upload goals (needs credential)

npm run championships:sync      # refresh the offline snapshot from the spreadsheet
npm run championships:assets    # process intake media and rebuild the asset manifest
npm run goals:inspect           # classify local clips, upload nothing
npm run goals:upload:dry        # report exactly what would be uploaded
npm run goals:upload            # upload and rebuild the goals manifest
npm run goals:verify            # check every published goal is hosted
```

Every script is idempotent: a second run with no changes rewrites nothing.

## Generated files

These are committed and must never be edited by hand. Each `generated/` folder
carries a README naming the script that writes it.

| File                                                                          | Written by                     |
| ----------------------------------------------------------------------------- | ------------------------------ |
| `src/features/championships/data/generated/championships.snapshot.json`       | `npm run championships:sync`   |
| `src/features/championships/data/generated/championship-assets.manifest.json` | `npm run championships:assets` |
| `src/features/goals/data/generated/goals.manifest.json`                       | `npm run goals:upload`         |

## Environment variables

Copy the shape below into a local `.env.local` (gitignored, never committed):

```env
# Public production URL for canonical and Open Graph metadata.
VITE_SITE_URL=https://example.com

# Cloudinary credential, read only by the local goal scripts.
# Never prefix it with VITE_: that would publish the API secret in the bundle.
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

`VITE_SITE_URL` is empty by default. `CLOUDINARY_URL` is only needed to upload
goals — the normal build never reads it and never contacts Cloudinary.

## Documentation

- [`docs/content-operations.md`](docs/content-operations.md) — administrator guide (Spanish)
- [`docs/championships-data-source.md`](docs/championships-data-source.md) — Google Sheets contract
- [`docs/goals-cloudinary-pipeline.md`](docs/goals-cloudinary-pipeline.md) — goals media pipeline
- [`docs/refactor-audit.md`](docs/refactor-audit.md) — architecture audit
- [`CLAUDE.md`](CLAUDE.md) — rules for coding agents

## Deployment

Static SPA with an `index.html` fallback rewrite, configured in `vercel.json` and
`netlify.toml`.
