import { gvizResponseSchema, type GvizTable } from '../schemas/googleVisualization.schema'

export class GoogleVisualizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GoogleVisualizationError'
  }
}

const WRAPPER_START = /google\.visualization\.Query\.setResponse\(/

/**
 * Safely parses a Google Visualization API response into its data table.
 *
 * The endpoint wraps a JSON object in a `google.visualization.Query.setResponse(...)`
 * call. This extracts the JSON slice by matching balanced braces (never `eval`
 * or `new Function`), runs `JSON.parse`, validates the shape with Zod and
 * rejects error responses.
 *
 * @throws {GoogleVisualizationError} when the wrapper, JSON or table is invalid.
 */
export function parseGoogleVisualizationResponse(raw: string): GvizTable {
  const text = raw.trim()
  if (text.length === 0) {
    throw new GoogleVisualizationError('Empty response')
  }

  const wrapper = WRAPPER_START.exec(text)
  const objectStart = wrapper ? text.indexOf('{', wrapper.index) : text.indexOf('{')

  if (objectStart === -1) {
    throw new GoogleVisualizationError('No JSON object found in response')
  }

  const json = extractBalancedObject(text, objectStart)
  if (json === undefined) {
    throw new GoogleVisualizationError('Unbalanced JSON object in response')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new GoogleVisualizationError('Invalid JSON in response')
  }

  const result = gvizResponseSchema.safeParse(parsed)
  if (!result.success) {
    throw new GoogleVisualizationError('Unexpected response shape')
  }

  const response = result.data
  if (response.status === 'error') {
    const reason = response.errors?.[0]?.message ?? response.errors?.[0]?.reason ?? 'unknown'
    throw new GoogleVisualizationError(`Google returned an error: ${reason}`)
  }

  if (!response.table) {
    throw new GoogleVisualizationError('Response has no table')
  }

  return response.table
}

function extractBalancedObject(text: string, start: number): string | undefined {
  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < text.length; i += 1) {
    const char = text[i]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
    } else if (char === '{') {
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return text.slice(start, i + 1)
      }
    }
  }

  return undefined
}
