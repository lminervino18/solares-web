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
- Campeonatos — `/campeonatos`
- Estadísticas — `/estadisticas`
- Goles — `/goles`
- Femenino y Mixto — `/femenino-mixto`

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
11. Dynamically load heavy libraries (`react-player`, lightbox, Three.js).
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
documented in the `README.md` of their folder (`media`, `data-display`, `navigation`) or as
minimal wrappers (`three`). Implement them with dynamic imports when a page renders them.

## Responsive and accessibility policy

- Verify at least 320, 375, 390, 768, 1024 and 1440 px: overflow, wrapping, navigation,
  touch targets, focus visibility, safe areas.
- Target WCAG AA. Use semantic HTML before ARIA. One `h1` per page. Keep the skip link and
  visible focus. Everything must work with mouse, keyboard, touch, screen reader, reduced
  motion and browser zoom.

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

- Team name, description, logo, social links, theme color, OG image: `src/config/site.config.ts`.
- Production URL: `VITE_SITE_URL` environment variable (see `README.md`), read by `site.config.ts`.
- Navigation items: `src/config/navigation.config.ts`.
- Design tokens: `src/styles/tokens/*`. Routes: `src/constants/routes.ts`.
- Local data: `src/data/*` (typed empty arrays). Domain types: `src/types/*`. Schemas: `src/schemas/*`.

## Known accepted lint warnings

`react-refresh/only-export-components` warns on files that export a component together with
its CVA variant function (idiomatic co-location) and on `routes.tsx`. These are development
hot-reload hints only; `npm run check` passes (0 errors). The rule stays enabled and visible;
do not disable it globally.

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

`npm run check` runs typecheck, lint, unit tests and build together. Do not claim a check
passed unless it was actually executed successfully.

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
