# Navigation

Secondary navigation components, prepared for later stages. The primary application
navigation lives in `src/components/layout` (`AppNavigation`, `MobileNavigation`).

- `Breadcrumbs` — accessible breadcrumb trail (`nav` + ordered list, current page marked
  with `aria-current="page"`).
- `Tabs` — accessible tabs built on the Radix Tabs primitive.
- `Pagination` — accessible pagination controls with labelled previous/next actions.

## Rules

- Prefer native semantic HTML and Radix primitives before custom ARIA.
- Keyboard accessible with visible focus.
- Configurable through semantic props and design tokens.
