# Solares Web

Official frontend website for Solares.

## Requirements

- Node.js 20.19+
- npm

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Validation

```bash
npm run check
```

Runs type checking, linting, unit tests and the production build.

## Production build

```bash
npm run build
npm run preview
```

## End-to-end tests

```bash
npx playwright install
npm run test:e2e
```

## Configuration

The production URL used for canonical and Open Graph metadata is read from the
`VITE_SITE_URL` environment variable (empty by default). Set it in a local `.env` file
once the production domain is confirmed.
