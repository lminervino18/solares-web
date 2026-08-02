import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Championship names read from the committed snapshot, which is exactly what the
 * app renders while the sheet request is stubbed out.
 *
 * The specs derive their expectations from here so publishing a new championship
 * never breaks them.
 *
 * Read from disk rather than imported: Playwright runs these specs as Node ESM,
 * where a JSON import needs an import attribute.
 */

type SnapshotChampionship = {
  readonly format: string
  readonly name: string
  readonly slug: string
  readonly published: boolean
}

const SNAPSHOT_URL = new URL(
  '../../../src/features/championships/data/generated/championships.snapshot.json',
  import.meta.url,
)

const snapshot = JSON.parse(readFileSync(fileURLToPath(SNAPSHOT_URL), 'utf-8')) as {
  championships: readonly SnapshotChampionship[]
}

const championships = snapshot.championships

export function publishedChampionships(format: 'f8' | 'f5'): readonly SnapshotChampionship[] {
  return championships.filter(
    (championship) => championship.format === format && championship.published,
  )
}

/** The championship the section selects when the URL carries no `torneo`. */
export function defaultChampionship(format: 'f8' | 'f5'): SnapshotChampionship {
  const first = publishedChampionships(format)[0]
  if (!first) throw new Error(`The snapshot has no published ${format} championship`)
  return first
}

/** The next one in the carousel, which the "siguiente" control moves to. */
export function secondChampionship(format: 'f8' | 'f5'): SnapshotChampionship | undefined {
  return publishedChampionships(format)[1]
}

/** A name that exists in one format only, proving a format switch happened. */
export function exclusiveChampionshipName(
  format: 'f8' | 'f5',
  other: 'f8' | 'f5',
): string | undefined {
  const otherNames = new Set(publishedChampionships(other).map((entry) => entry.name))
  return publishedChampionships(format).find((entry) => !otherNames.has(entry.name))?.name
}

type SnapshotScorer = { readonly playerName: string; readonly goals: number }

type ScoringChampionship = SnapshotChampionship & { readonly scorers: readonly SnapshotScorer[] }

/** The historical top scorer of a format, used to exercise the scorer search. */
export function topScorerName(format: 'f8' | 'f5'): string | undefined {
  const totals = new Map<string, number>()
  for (const championship of championships as readonly ScoringChampionship[]) {
    if (championship.format !== format) continue
    for (const scorer of championship.scorers ?? []) {
      totals.set(scorer.playerName, (totals.get(scorer.playerName) ?? 0) + scorer.goals)
    }
  }
  return [...totals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
}
