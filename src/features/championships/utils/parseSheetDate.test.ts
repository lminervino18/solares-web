import { describe, expect, it } from 'vitest'

import { parseSheetDate } from './parseSheetDate'

describe('parseSheetDate', () => {
  it('parses a gviz Date value with a zero-indexed month', () => {
    expect(parseSheetDate('Date(2022,3,4)')).toBe('2022-04-04')
  })

  it('parses a gviz Date with time', () => {
    expect(parseSheetDate('Date(2025,11,15,22,0,0)')).toBe('2025-12-15')
  })

  it('parses a d/m/yyyy formatted value', () => {
    expect(parseSheetDate('4/04/2022')).toBe('2022-04-04')
    expect(parseSheetDate('15/12/2025')).toBe('2025-12-15')
  })

  it('returns undefined for empty or invalid input', () => {
    expect(parseSheetDate('')).toBeUndefined()
    expect(parseSheetDate(null)).toBeUndefined()
    expect(parseSheetDate(undefined)).toBeUndefined()
    expect(parseSheetDate('not a date')).toBeUndefined()
    expect(parseSheetDate({})).toBeUndefined()
  })

  it('rejects impossible months', () => {
    expect(parseSheetDate('Date(2022,20,4)')).toBeUndefined()
  })
})
