# Solares Web

Official site for Solares. Static SPA, no backend and no database: sports data
comes from a public Google Sheet on every visit, and goal clips are delivered by
Cloudinary through a committed manifest.

![Solares home page](docs/screenshots/home.png)

React 19 · React Router 7 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · Vitest ·
Playwright

## Run

Needs Node.js 20.19+.

```bash
npm install
npm run dev
```

## Validate before pushing

```bash
npm run validate
```

Format, types, lint, tests and build. No credential and no network needed.

```bash
npx playwright install   # once
npm run test:e2e
```

## Adding content

None of this touches a component. Full guide (Spanish) in
[`docs/content-operations.md`](docs/content-operations.md).

| Task               | How                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| New championship   | Add it to the spreadsheet. It appears on the next page load                                     |
| Team photo or logo | Drop it in `content/incoming/championships/{f8,f5}/{slug}/`, run `npm run championships:assets` |
| New goals          | Drop the clips in `content/incoming/goals/{f8,f5}/`, run `npm run goals:sync`                   |

```bash
npm run content:check    # validate manifests and classify local clips
npm run content:sync     # refresh everything (needs CLOUDINARY_URL)
```

Every script is idempotent: a second run with no changes rewrites nothing.

## Environment

In a local `.env.local` (never committed):

```env
VITE_SITE_URL=https://solaresfutbol.com
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

`VITE_SITE_URL` builds the canonical and `og:url` tags and is baked in at build
time, so changing it needs a redeploy. `CLOUDINARY_URL` is read only by the local
goal scripts — never prefix it with `VITE_`.

## Generated files

Committed, never edited by hand.

| File                                                                          | Written by                     |
| ----------------------------------------------------------------------------- | ------------------------------ |
| `src/features/championships/data/generated/championships.snapshot.json`       | `npm run championships:sync`   |
| `src/features/championships/data/generated/championship-assets.manifest.json` | `npm run championships:assets` |
| `src/features/goals/data/generated/goals.manifest.json`                       | `npm run goals:upload`         |
| `docs/screenshots/home.png`                                                   | `npm run assets:screenshots`   |
| `public/og-image.png`                                                         | `npm run assets:og-image`      |

## Documentation

- [Content operations](docs/content-operations.md) — administrator guide (Spanish)
- [Deployment](docs/deployment.md) — Vercel and the custom domain (Spanish)
- [Championships data source](docs/championships-data-source.md) — spreadsheet contract
- [Goals pipeline](docs/goals-cloudinary-pipeline.md) — Cloudinary
- [Architecture audit](docs/refactor-audit.md)
