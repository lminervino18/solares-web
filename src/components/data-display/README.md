# Data display

Data presentation components, prepared for later stages. Implement each one when a page
renders real data. Keep large datasets in `src/data`, not inside these components.

- `StatCard` — highlighted single metric with label, value and optional trend.
- `DataTable` — responsive table with a mobile-friendly strategy (horizontal scroll or
  stacked rows). Plan the responsive behavior before implementing.
- `ProgressBar` — accessible progress indicator (`role="progressbar"` with aria values).
- `RankingItem` — position, subject and value row for rankings.

## Rules

- Configurable through semantic props (`size`, `variant`, `tone`).
- No hardcoded colors; use design tokens.
- Accessible and responsive by default.
