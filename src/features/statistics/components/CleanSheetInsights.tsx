import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import type { CleanSheetStatistics } from '../types/statistics'
import { formatInteger, formatPercent } from '../utils/formatNumber'
import { StatTile } from './StatTile'

export type CleanSheetInsightsProps = {
  cleanSheets: CleanSheetStatistics
  scopeLabel: string
}

/**
 * Clean sheet insights: total, share of matches, longest run and the tournament
 * with the most. A clean sheet is a match with no goals conceded; it is never
 * attributed to a specific goalkeeper since the source does not record one.
 */
export function CleanSheetInsights({ cleanSheets, scopeLabel }: CleanSheetInsightsProps) {
  return (
    <section aria-label={`Arcos en cero de ${scopeLabel}`}>
      <Heading as="h2" size="xl" className="mb-1">
        Arcos en cero
      </Heading>
      <Text as="p" size="sm" tone="muted" className="mb-4">
        Partidos en los que Solares no recibió goles.
      </Text>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total" value={formatInteger(cleanSheets.total)} emphasis />
        <StatTile label="Sobre PJ" value={formatPercent(cleanSheets.rate)} />
        <StatTile label="Mejor racha" value={formatInteger(cleanSheets.longestStreak)} />
        <StatTile
          label="Torneo con más"
          value={cleanSheets.bestTournament ? formatInteger(cleanSheets.bestTournament.count) : '—'}
          {...(cleanSheets.bestTournament ? { hint: cleanSheets.bestTournament.name } : {})}
        />
      </div>
    </section>
  )
}
