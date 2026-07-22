export type TournamentPhase =
  'group' | 'round-of-16' | 'quarterfinal' | 'semifinal' | 'final' | 'playoff' | 'unknown'

const KNOCKOUT_PHASES: ReadonlySet<TournamentPhase> = new Set([
  'round-of-16',
  'quarterfinal',
  'semifinal',
  'final',
  'playoff',
])

/**
 * Classifies a match stage label into a normalized tournament phase. Only
 * explicitly recognized labels map to a phase; anything else is `unknown`, so
 * knockout statistics never rely on a loose match of the word "fase".
 */
export function classifyPhase(stage: string | undefined): TournamentPhase {
  if (!stage) return 'unknown'
  const value = stage.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

  if (value.includes('regular') || value.includes('grupo') || value.includes('liga')) return 'group'
  if (value.includes('octavo')) return 'round-of-16'
  if (value.includes('cuarto')) return 'quarterfinal'
  // "semifinal" contains "final", so it must be checked first.
  if (value.includes('semifinal')) return 'semifinal'
  if (value.includes('repechaje') || value.includes('playoff') || value.includes('play-off')) {
    return 'playoff'
  }
  if (value.includes('final')) return 'final'
  return 'unknown'
}

export function isKnockoutPhase(phase: TournamentPhase): boolean {
  return KNOCKOUT_PHASES.has(phase)
}
