import { CHAMPIONSHIPS_SPREADSHEET_ID } from '@/config/championships-source.config'

export type BuildGoogleSheetUrlOptions = {
  readonly cacheBust?: number
}

/**
 * Builds the public Google Visualization JSON endpoint for a sheet `gid`.
 *
 * An optional `cacheBust` timestamp is appended as `_ts` to defeat browser or
 * proxy caching when a fresh read is required.
 */
export function buildGoogleSheetUrl(gid: string, options: BuildGoogleSheetUrlOptions = {}): string {
  const base = `https://docs.google.com/spreadsheets/d/${CHAMPIONSHIPS_SPREADSHEET_ID}/gviz/tq`
  const params = new URLSearchParams({ gid, tqx: 'out:json' })
  if (options.cacheBust !== undefined) {
    params.set('_ts', String(options.cacheBust))
  }
  return `${base}?${params.toString()}`
}
