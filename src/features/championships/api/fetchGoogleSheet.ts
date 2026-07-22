import { buildGoogleSheetUrl } from './buildGoogleSheetUrl'
import {
  GoogleVisualizationError,
  parseGoogleVisualizationResponse,
} from './parseGoogleVisualizationResponse'
import type { GvizTable } from '../schemas/googleVisualization.schema'

export type FetchGoogleSheetOptions = {
  readonly signal?: AbortSignal
  readonly cacheBust?: number
  readonly fetchImpl?: typeof fetch
}

/**
 * Fetches a single sheet from the public spreadsheet and returns its parsed
 * data table.
 *
 * Uses `cache: 'no-store'` so a reload always revalidates against the source.
 * The response is validated by {@link parseGoogleVisualizationResponse}.
 *
 * @throws {GoogleVisualizationError} on a non-OK HTTP status or invalid payload.
 */
export async function fetchGoogleSheet(
  gid: string,
  options: FetchGoogleSheetOptions = {},
): Promise<GvizTable> {
  const fetchImpl = options.fetchImpl ?? fetch
  const url = buildGoogleSheetUrl(
    gid,
    options.cacheBust !== undefined ? { cacheBust: options.cacheBust } : {},
  )

  const response = await fetchImpl(url, {
    cache: 'no-store',
    ...(options.signal ? { signal: options.signal } : {}),
  })

  if (!response.ok) {
    throw new GoogleVisualizationError(`HTTP ${response.status} while fetching sheet ${gid}`)
  }

  const raw = await response.text()
  return parseGoogleVisualizationResponse(raw)
}
