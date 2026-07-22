import { describe, expect, it } from 'vitest'

import { formatAverage, formatPercent, formatSignedDifference } from './formatNumber'

describe('formatNumber', () => {
  it('formats percentages with one decimal in es-AR', () => {
    expect(formatPercent(0.589)).toBe('58,9 %')
    expect(formatPercent(1)).toBe('100,0 %')
  })

  it('formats averages with one decimal', () => {
    expect(formatAverage(3.63)).toBe('3,6')
  })

  it('returns a dash for undefined rate or average', () => {
    expect(formatPercent(undefined)).toBe('—')
    expect(formatAverage(undefined)).toBe('—')
  })

  it('formats signed differences without +0 or -0', () => {
    expect(formatSignedDifference(24)).toBe('+24')
    expect(formatSignedDifference(-12)).toBe('-12')
    expect(formatSignedDifference(0)).toBe('0')
  })
})
