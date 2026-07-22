import { useState } from 'react'

import { cn } from '@/lib/cn'
import { Button } from '@/components/primitives/Button/Button'
import { Badge, type BadgeProps } from '@/components/primitives/Badge/Badge'
import type { Match, MatchOutcome, MatchScorer } from '../types/championships'
import { OUTCOME_LABEL, formatMatchDate } from '../utils/championshipLabels'
import { SoccerBallIcon } from './SoccerBallIcon'

export type MatchResultsProps = {
  matches: readonly Match[]
}

const INITIAL_COUNT = 5
const MAX_BALLS = 6

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

function ScorerRow({ scorer }: { scorer: MatchScorer }) {
  const balls = Math.min(scorer.goals, MAX_BALLS)
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="truncate text-[length:var(--font-size-sm)] text-primary">{scorer.name}</span>
      <span className="flex shrink-0 items-center gap-0.5 text-brand" aria-hidden="true">
        {Array.from({ length: balls }).map((_, index) => (
          <SoccerBallIcon key={index} className="size-3.5" />
        ))}
        {scorer.goals > MAX_BALLS && (
          <span className="ml-1 text-[length:var(--font-size-xs)] font-semibold tabular-nums">
            ×{scorer.goals}
          </span>
        )}
      </span>
    </li>
  )
}

function MatchRow({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false)
  const meta = matchMeta(match)
  const hasScorers = match.scorers.length > 0

  return (
    <li className="group rounded-(--radius-md) border border-line bg-surface-elevated">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-[length:var(--font-size-sm)] font-medium text-primary">
            {match.opponent}
          </p>
          {meta && <p className="truncate text-[length:var(--font-size-xs)] text-muted">{meta}</p>}
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
          {hasScorers && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              aria-label={`Ver goleadores contra ${match.opponent}`}
              className={cn(
                'flex size-7 items-center justify-center rounded-full border border-line text-secondary transition-colors',
                'hover:border-line-strong hover:text-brand',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
                expanded && 'border-line-strong text-brand',
              )}
            >
              <SoccerBallIcon className="size-4" />
            </button>
          )}
        </div>
      </div>
      {hasScorers && (
        <div
          className={cn(
            'border-t border-line/60 px-3 py-2',
            expanded ? 'block' : 'hidden group-hover:block',
          )}
        >
          <ul className="flex flex-col gap-1">
            {match.scorers.map((scorer) => (
              <ScorerRow key={scorer.name} scorer={scorer} />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

/**
 * Lists the championship matches, initially the first five, with an accessible
 * control to reveal the rest. Each match exposes a football toggle that reveals
 * that match's goalscorers, mapped to the exact game.
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
        {visible.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
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
