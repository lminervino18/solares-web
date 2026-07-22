import { describe, expect, it } from 'vitest'

import {
  GoogleVisualizationError,
  parseGoogleVisualizationResponse,
} from './parseGoogleVisualizationResponse'

function wrap(payload: string): string {
  return `/*O_o*/\ngoogle.visualization.Query.setResponse(${payload});`
}

const validTable = {
  status: 'ok',
  table: {
    cols: [{ label: 'Rival', type: 'string' }],
    rows: [{ c: [{ v: 'Elfos' }] }],
  },
}

describe('parseGoogleVisualizationResponse', () => {
  it('parses a valid wrapped response', () => {
    const table = parseGoogleVisualizationResponse(wrap(JSON.stringify(validTable)))
    expect(table.cols).toHaveLength(1)
    expect(table.rows).toHaveLength(1)
  })

  it('tolerates surrounding whitespace', () => {
    const table = parseGoogleVisualizationResponse(`   \n ${wrap(JSON.stringify(validTable))}  \n`)
    expect(table.rows[0]?.c[0]?.v).toBe('Elfos')
  })

  it('parses a bare JSON object without the wrapper', () => {
    const table = parseGoogleVisualizationResponse(JSON.stringify(validTable))
    expect(table.cols).toHaveLength(1)
  })

  it('throws on an empty response', () => {
    expect(() => parseGoogleVisualizationResponse('   ')).toThrow(GoogleVisualizationError)
  })

  it('throws on a Google error status', () => {
    const payload = wrap(
      JSON.stringify({ status: 'error', errors: [{ message: 'Invalid query' }] }),
    )
    expect(() => parseGoogleVisualizationResponse(payload)).toThrow(/Invalid query/)
  })

  it('throws on an invalid wrapper without JSON', () => {
    expect(() => parseGoogleVisualizationResponse('setResponse(oops)')).toThrow(
      GoogleVisualizationError,
    )
  })

  it('throws on invalid JSON', () => {
    expect(() => parseGoogleVisualizationResponse(wrap('{ not json }'))).toThrow(
      GoogleVisualizationError,
    )
  })

  it('throws when the table is missing', () => {
    expect(() => parseGoogleVisualizationResponse(wrap(JSON.stringify({ status: 'ok' })))).toThrow(
      /no table/i,
    )
  })

  it('accepts a table with no rows', () => {
    const payload = wrap(JSON.stringify({ status: 'ok', table: { cols: [], rows: [] } }))
    const table = parseGoogleVisualizationResponse(payload)
    expect(table.rows).toHaveLength(0)
  })

  it('handles braces inside string values', () => {
    const payload = wrap(
      JSON.stringify({
        status: 'ok',
        table: { cols: [{ label: 'x' }], rows: [{ c: [{ v: 'a {nested} b' }] }] },
      }),
    )
    const table = parseGoogleVisualizationResponse(payload)
    expect(table.rows[0]?.c[0]?.v).toBe('a {nested} b')
  })
})
