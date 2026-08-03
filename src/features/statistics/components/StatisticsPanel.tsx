import { useMemo } from 'react'

import { Heading } from '@/components/primitives/Heading/Heading'
import { FOOTBALL_FORMAT_LONG_LABEL } from '@/config/football-format'
import type { ChampionshipsByFormat } from '@/features/championships/types/championships'
import { buildStatisticsViewModel } from '../selectors/buildStatisticsViewModel'
import type { StatisticsScope } from '../types/statistics'
import { formatInteger, formatPercent } from '../utils/formatNumber'
import { AnnualEvolutionChart } from './AnnualEvolutionChart'
import { ChampionshipHonors } from './ChampionshipHonors'
import { CleanSheetInsights } from './CleanSheetInsights'
import { HistoricalScorersTable } from './HistoricalScorersTable'
import { HistoricalSummary } from './HistoricalSummary'
import { KickoffTimeChart } from './KickoffTimeChart'
import { KnockoutScorers } from './KnockoutScorers'
import { MatchRecords } from './MatchRecords'
import { OpponentAnalysis } from './OpponentAnalysis'
import { StatTile } from './StatTile'
import { StreakRecords } from './StreakRecords'
import { TournamentComparisonChart } from './TournamentComparisonChart'
import { VenueChart } from './VenueChart'

export type StatisticsPanelProps = {
  data: ChampionshipsByFormat
  scope: StatisticsScope
}

export function StatisticsPanel({ data, scope }: StatisticsPanelProps) {
  const viewModel = useMemo(() => buildStatisticsViewModel(data, scope), [data, scope])
  const scopeLabel = FOOTBALL_FORMAT_LONG_LABEL[scope]
  const { extra } = viewModel

  return (
    <div className="flex flex-col gap-14">
      <HistoricalSummary general={viewModel.general} scopeLabel={scopeLabel} />
      <ChampionshipHonors achievements={viewModel.achievements} scopeLabel={scopeLabel} />
      <HistoricalScorersTable scorers={viewModel.scorers} scopeLabel={scopeLabel} />
      <TournamentComparisonChart tournaments={viewModel.tournaments} scopeLabel={scopeLabel} />
      <StreakRecords streaks={viewModel.streaks} scopeLabel={scopeLabel} />
      <MatchRecords records={viewModel.records} scopeLabel={scopeLabel} />
      <OpponentAnalysis opponents={viewModel.opponents} scopeLabel={scopeLabel} />

      <div className="grid gap-8 lg:grid-cols-2">
        <CleanSheetInsights cleanSheets={viewModel.cleanSheets} scopeLabel={scopeLabel} />
        <KnockoutScorers scorers={viewModel.knockoutScorers} scopeLabel={scopeLabel} />
      </div>

      <VenueChart venues={viewModel.venues} scopeLabel={scopeLabel} />
      <KickoffTimeChart kickoffTimes={viewModel.kickoffTimes} scopeLabel={scopeLabel} />
      <AnnualEvolutionChart annual={viewModel.annual} scopeLabel={scopeLabel} />

      <section aria-label={`Datos adicionales de ${scopeLabel}`}>
        <Heading as="h2" size="xl" className="mb-4">
          Datos adicionales
        </Heading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Goleadores distintos" value={formatInteger(extra.uniqueScorers)} />
          <StatTile
            label="Concentración top 3"
            value={formatPercent(extra.concentration.topThreeShare)}
            hint="sobre goles con autor"
          />
          <StatTile
            label="Mejor % (mín. 5 PJ)"
            value={formatPercent(extra.bestTournamentByWinRate?.winRate)}
            {...(extra.bestTournamentByWinRate
              ? { hint: extra.bestTournamentByWinRate.championshipName }
              : {})}
          />
          <StatTile
            label="Torneo más goleador"
            value={
              extra.topScoringTournament ? formatInteger(extra.topScoringTournament.goalsFor) : '—'
            }
            {...(extra.topScoringTournament
              ? { hint: extra.topScoringTournament.championshipName }
              : {})}
          />
        </div>
      </section>
    </div>
  )
}
