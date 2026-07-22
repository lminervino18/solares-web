const integerFormatter = new Intl.NumberFormat('es-AR')
const decimalFormatter = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatInteger(value: number): string {
  return integerFormatter.format(value)
}

/**
 * Formats a 0..1 rate as an `es-AR` percentage with one decimal, e.g. `68,4 %`.
 * Returns a dash for an undefined rate.
 */
export function formatPercent(rate: number | undefined): string {
  if (rate === undefined || !Number.isFinite(rate)) return '—'
  return `${decimalFormatter.format(rate * 100)} %`
}

/**
 * Formats an average (goals per match, etc.) with one decimal in `es-AR`.
 */
export function formatAverage(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) return '—'
  return decimalFormatter.format(value)
}

/**
 * Formats a goal difference with an explicit sign, avoiding `+0` / `-0`.
 */
export function formatSignedDifference(value: number): string {
  if (value > 0) return `+${integerFormatter.format(value)}`
  if (value < 0) return integerFormatter.format(value)
  return '0'
}
