import { useState } from 'react'

import { Text } from '@/components/primitives/Text/Text'
import type { GoalFormat, GoalVideo } from '../../types/goals'
import { useGoalFilters } from '../../hooks/useGoalFilters'
import { buildGoalShareUrl } from '../../utils/buildGoalShareUrl'
import { GoalEmptyState } from '../GoalEmptyState/GoalEmptyState'
import { GoalFilters } from '../GoalFilters/GoalFilters'
import { GoalGrid } from '../GoalGrid/GoalGrid'
import { GoalPlayer } from '../GoalPlayer/GoalPlayer'

export type GoalGalleryProps = {
  goals: readonly GoalVideo[]
  format?: GoalFormat
  fixedCompetitionId?: string
  showFilters?: boolean
  showCompetitionFilter?: boolean
  showDensityControls?: boolean
  showRandomButton?: boolean
  emptyBehavior?: 'show' | 'hide'
  syncUrl?: boolean
  initialVisible?: number
}

const DEFAULT_VISIBLE = 24
const PAGE_SIZE = 24

export function GoalGallery({
  goals,
  format,
  fixedCompetitionId,
  showFilters = true,
  showCompetitionFilter = true,
  showDensityControls = true,
  showRandomButton = true,
  emptyBehavior = 'show',
  syncUrl = true,
  initialVisible = DEFAULT_VISIBLE,
}: GoalGalleryProps) {
  const state = useGoalFilters({
    goals,
    syncUrl,
    ...(format === undefined ? {} : { fixedFormat: format }),
    ...(fixedCompetitionId === undefined ? {} : { fixedCompetitionId }),
  })

  // A new result set restarts from the first page, derived during render so no
  // effect is needed and "Mostrar más" cannot leave a stale window open.
  const resultKey = `${state.format}|${state.competitionId}|${state.scorerId}`
  const [page, setPage] = useState({ key: resultKey, count: initialVisible })
  const visibleCount = page.key === resultKey ? page.count : initialVisible

  if (state.formatGoals.length === 0) {
    if (emptyBehavior === 'hide') return null
    return <GoalEmptyState variant="no-goals" />
  }

  const shareUrl =
    state.openGoal === undefined
      ? ''
      : buildGoalShareUrl(
          state.openGoal,
          { competitionId: state.competitionId, scorerId: state.scorerId },
          typeof window === 'undefined' ? '' : window.location.origin,
        )

  return (
    <div className="flex flex-col gap-6">
      {state.missingGoal && (
        <Text size="sm" tone="muted" role="status">
          Ese gol ya no está disponible.
        </Text>
      )}

      {showFilters && (
        <GoalFilters
          competitionOptions={state.competitionOptions}
          scorerOptions={state.scorerOptions}
          competitionId={state.competitionId}
          scorerId={state.scorerId}
          competitionScopeTotal={state.competitionScopeTotal}
          scorerScopeTotal={state.scorerScopeTotal}
          filteredGoals={state.filteredGoals}
          density={state.density}
          {...(state.openGoal === undefined ? {} : { currentGoalId: state.openGoal.id })}
          showCompetitionFilter={showCompetitionFilter && fixedCompetitionId === undefined}
          showDensityControls={showDensityControls}
          showRandomButton={showRandomButton}
          onCompetitionChange={state.setCompetition}
          onScorerChange={state.setScorer}
          onDensityChange={state.setDensity}
          onClearFilters={state.clearFilters}
          onPickRandom={state.openGoalById}
        />
      )}

      {state.filteredGoals.length === 0 ? (
        <GoalEmptyState variant="no-results" onClearFilters={state.clearFilters} />
      ) : (
        <GoalGrid
          goals={state.filteredGoals}
          visibleCount={visibleCount}
          density={state.density}
          onOpen={state.openGoalById}
          onShowMore={() => setPage({ key: resultKey, count: visibleCount + PAGE_SIZE })}
        />
      )}

      {state.openGoal !== undefined && (
        <GoalPlayer
          goal={state.openGoal}
          goals={state.filteredGoals}
          shareUrl={shareUrl}
          onNavigate={state.openGoalById}
          onClose={state.closeGoal}
        />
      )}
    </div>
  )
}
