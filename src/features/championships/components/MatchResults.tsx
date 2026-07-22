import { useState } from 'react'

import { Button } from '@/components/primitives/Button/Button'
import { Badge, type BadgeProps } from '@/components/primitives/Badge/Badge'
import type { Match, MatchOutcome } from '../types/championships'
import { OUTCOME_LABEL, formatMatchDate } from '../utils/championshipLabels'

export type MatchResultsProps = {
  matches: readonly Match[]
}

const INITIAL_COUNT = 5

const OUTCOME_TONE: Record<MatchOutcome, BadgeProps['tone']> = {
  win: 'success',
  draw: 'neutral',
  loss: 'danger',
  pending: 'neutral',
  cancelled: 'warning',
}

function matchMeta(match: Match): string {
  const date = formatMatchDate(match.date)
  return [date, match.stage].filter(Boolean).join(' · ')
}

/**
 * Lists the championship matches, initially the first five, with an accessible
 * control to reveal the rest. Outcomes are conveyed by both label and tone.
 */
export function MatchResults({ matches }: MatchResultsProps) {
  const [expanded, setExpanded] = useState(false)

  if (matches.length === 0) {
    return (
      <p className="text-[length:var(--font-size-sm)] text-muted">
        Todavía no hay partidos cargados para este campeonato.
      </p>
    )
  }

  const visible = expanded ? matches : matches.slice(0, INITIAL_COUNT)
  const canExpand = matches.length > INITIAL_COUNT

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {visible.map((match) => {
          const meta = matchMeta(match)
          return (
            <li
              key={match.id}
              className="flex items-center justify-between gap-3 rounded-(--radius-md) border border-line bg-surface-elevated px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-[length:var(--font-size-sm)] font-medium text-primary">
                  {match.opponent}
                </p>
                {meta && (
                  <p className="truncate text-[length:var(--font-size-xs)] text-muted">{meta}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {match.scoreLabel && (
                  <span className="text-[length:var(--font-size-sm)] font-bold text-primary tabular-nums">
                    {match.scoreLabel}
                  </span>
                )}
                <Badge tone={OUTCOME_TONE[match.outcome]} variant="soft" size="sm">
                  {OUTCOME_LABEL[match.outcome]}
                </Badge>
              </div>
            </li>
          )
        })}
      </ul>
      {canExpand && (
        <Button
          type="button"
          tone="neutral"
          variant="text"
          size="sm"
          className="mt-3"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Mostrar menos' : 'Ver todos los partidos'}
        </Button>
      )}
    </div>
  )
}
