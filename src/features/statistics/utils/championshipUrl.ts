import { DEFAULT_FOOTBALL_FORMAT, type FootballFormat } from '@/config/championships-source.config'
import { routes } from '@/constants/routes'

/**
 * Builds the Campeonatos URL for a championship, matching the format-scoped
 * query convention (F8 is canonical without a `modalidad` param).
 */
export function championshipUrl(format: FootballFormat, slug: string): string {
  const params = new URLSearchParams()
  if (format !== DEFAULT_FOOTBALL_FORMAT) params.set('modalidad', format)
  params.set('torneo', slug)
  return `${routes.championships}?${params.toString()}`
}
