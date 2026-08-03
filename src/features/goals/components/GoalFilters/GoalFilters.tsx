import { X } from 'lucide-react'

import { Button } from '@/components/primitives/Button/Button'
import { Text } from '@/components/primitives/Text/Text'
import type { GoalVideo } from '../../types/goals'
import { ALL_FILTER } from '../../selectors/selectFilteredGoals'
import type { GoalCompetitionOption } from '../../selectors/selectGoalCompetitionOptions'
import type { GoalScorerOption } from '../../selectors/selectGoalScorerOptions'
import type { GoalDensity } from '../../utils/parseGoalUrlState'
import { GoalCompetitionFilter } from '../GoalCompetitionFilter/GoalCompetitionFilter'
import { GoalDensityControl } from '../GoalDensityControl/GoalDensityControl'
import { GoalRandomButton } from '../GoalRandomButton/GoalRandomButton'
import { GoalScorerCombobox } from '../GoalScorerCombobox/GoalScorerCombobox'

export type GoalFiltersProps = {
  competitionOptions: readonly GoalCompetitionOption[]
  scorerOptions: readonly GoalScorerOption[]
  competitionId: string
  scorerId: string
  competitionScopeTotal: number
  scorerScopeTotal: number
  filteredGoals: readonly GoalVideo[]
  density: GoalDensity
  currentGoalId?: string
  showCompetitionFilter?: boolean
  showDensityControls?: boolean
  showRandomButton?: boolean
  onCompetitionChange: (competitionId: string, slug?: string) => void
  onScorerChange: (scorerId: string, slug?: string) => void
  onDensityChange: (density: GoalDensity) => void
  onClearFilters: () => void
  onPickRandom: (goal: GoalVideo) => void
}

function buildSummary(
  count: number,
  competition: GoalCompetitionOption | undefined,
  scorer: GoalScorerOption | undefined,
): string {
  const goals = count === 1 ? '1 gol' : `${count} goles`
  const scorerPart = scorer === undefined ? '' : ` de ${scorer.name}`
  const competitionPart = competition === undefined ? '' : ` en ${competition.name}`
  return `${goals}${scorerPart}${competitionPart}`
}

export function GoalFilters({
  competitionOptions,
  scorerOptions,
  competitionId,
  scorerId,
  competitionScopeTotal,
  scorerScopeTotal,
  filteredGoals,
  density,
  currentGoalId,
  showCompetitionFilter = true,
  showDensityControls = true,
  showRandomButton = true,
  onCompetitionChange,
  onScorerChange,
  onDensityChange,
  onClearFilters,
  onPickRandom,
}: GoalFiltersProps) {
  const activeCompetition = competitionOptions.find((option) => option.id === competitionId)
  const activeScorer = scorerOptions.find((option) => option.id === scorerId)
  const hasFilters = competitionId !== ALL_FILTER || scorerId !== ALL_FILTER

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {showCompetitionFilter && (
          <GoalCompetitionFilter
            options={competitionOptions}
            value={competitionId}
            totalGoals={competitionScopeTotal}
            onChange={onCompetitionChange}
          />
        )}
        <GoalScorerCombobox
          options={scorerOptions}
          value={scorerId}
          totalGoals={scorerScopeTotal}
          onChange={onScorerChange}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Text size="sm" tone="primary" weight="semibold">
            {buildSummary(filteredGoals.length, activeCompetition, activeScorer)}
          </Text>
          {hasFilters && (
            <Button
              type="button"
              variant="text"
              tone="brand"
              size="sm"
              leadingIcon={<X aria-hidden className="size-3.5" />}
              onClick={onClearFilters}
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showRandomButton && (
            <GoalRandomButton
              goals={filteredGoals}
              {...(currentGoalId === undefined ? {} : { currentGoalId })}
              onPick={onPickRandom}
            />
          )}
          {showDensityControls && <GoalDensityControl value={density} onChange={onDensityChange} />}
        </div>
      </div>
    </div>
  )
}
