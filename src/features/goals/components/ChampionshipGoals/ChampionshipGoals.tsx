import { useMemo } from 'react'

import { Heading } from '@/components/primitives/Heading/Heading'
import { goals as allGoals } from '../../data/goals'
import type { GoalFormat } from '../../types/goals'
import { selectGoalsByChampionship } from '../../selectors/selectFilteredGoals'
import { GoalGallery } from '../GoalGallery/GoalGallery'

export type ChampionshipGoalsProps = {
  championshipId: string
  format: GoalFormat
}

/**
 * The goal gallery embedded in a championship.
 *
 * Goals are matched by format and championship id, never by display name. When
 * a championship has no goals the whole section is omitted — no heading, no
 * placeholder. The gallery keeps its own state here because the Campeonatos
 * page already owns the query string.
 */
export function ChampionshipGoals({ championshipId, format }: ChampionshipGoalsProps) {
  const championshipGoals = useMemo(
    () => selectGoalsByChampionship(allGoals, format, championshipId),
    [format, championshipId],
  )

  if (championshipGoals.length === 0) return null

  const hasSeveralScorers = new Set(championshipGoals.map((goal) => goal.scorer.id)).size > 1

  return (
    <section aria-label="Goles grabados">
      <Heading as="h3" size="lg" className="mb-3">
        Goles grabados
      </Heading>
      <GoalGallery
        goals={championshipGoals}
        format={format}
        syncUrl={false}
        showFilters={hasSeveralScorers}
        showCompetitionFilter={false}
        showDensityControls={false}
        emptyBehavior="hide"
        initialVisible={12}
      />
    </section>
  )
}
