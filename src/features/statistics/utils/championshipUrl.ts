import type { FootballFormat } from '@/config/football-format'
import { QUERY_PARAMS, writeFormatParam } from '@/config/query-params'
import { routes } from '@/constants/routes'

export function championshipUrl(format: FootballFormat, slug: string): string {
  const params = new URLSearchParams()
  writeFormatParam(params, format)
  params.set(QUERY_PARAMS.championship, slug)
  return `${routes.championships}?${params.toString()}`
}
