import { SearchX, Video } from 'lucide-react'

import { Button } from '@/components/primitives/Button/Button'
import { EmptyState } from '@/components/feedback/EmptyState/EmptyState'

export type GoalEmptyStateProps = {
  variant: 'no-results' | 'no-goals'
  onClearFilters?: () => void
}

/**
 * Empty states for the gallery. Filters stay on screen so the visitor can
 * adjust them, and no goal from another format is ever offered as a fallback.
 */
export function GoalEmptyState({ variant, onClearFilters }: GoalEmptyStateProps) {
  if (variant === 'no-goals') {
    return (
      <EmptyState
        icon={Video}
        title="Todavía no hay goles disponibles en esta modalidad."
        description="Cuando se agreguen, aparecerán acá."
      />
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <EmptyState
        icon={SearchX}
        title="No encontramos goles con estos filtros."
        description="Probá con otro torneo o goleador."
      />
      {onClearFilters !== undefined && (
        <Button type="button" variant="outline" tone="brand" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
