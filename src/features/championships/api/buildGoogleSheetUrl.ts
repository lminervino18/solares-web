import { CHAMPIONSHIPS_SPREADSHEET_ID } from '@/config/championships-source.config'

export type BuildGoogleSheetUrlOptions = {
  readonly cacheBust?: number
}

export function buildGoogleSheetUrl(gid: string, options: BuildGoogleSheetUrlOptions = {}): string {
  const base = `https://docs.google.com/spreadsheets/d/${CHAMPIONSHIPS_SPREADSHEET_ID}/gviz/tq`
  const params = new URLSearchParams({ gid, tqx: 'out:json' })
  if (options.cacheBust !== undefined) {
    params.set('_ts', String(options.cacheBust))
  }
  return `${base}?${params.toString()}`
}
