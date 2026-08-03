const integerFormatter = new Intl.NumberFormat('es-AR')
const decimalFormatter = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatInteger(value: number): string {
  return integerFormatter.format(value)
}

export function formatPercent(rate: number | undefined): string {
  if (rate === undefined || !Number.isFinite(rate)) return '—'
  return `${decimalFormatter.format(rate * 100)} %`
}

export function formatAverage(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) return '—'
  return decimalFormatter.format(value)
}

export function formatSignedDifference(value: number): string {
  if (value > 0) return `+${integerFormatter.format(value)}`
  if (value < 0) return integerFormatter.format(value)
  return '0'
}
