import { useEffect } from 'react'

import type { GoalVideo } from '../types/goals'
import { selectGoalPlaybackUrl } from '../utils/selectGoalPlaybackUrl'

/** First chunk only: enough to warm the CDN edge without paying for the clip. */
const PREFETCH_BYTES = 262_144

type ConnectionInfo = { saveData?: boolean }

function prefersLessData(): boolean {
  const connection = (navigator as Navigator & { connection?: ConnectionInfo }).connection
  return connection?.saveData === true
}

/**
 * Warms the clips the player can move to next.
 *
 * A first view of a clip pays for a cold CDN edge, which is most of the wait —
 * the same request served again from the edge is an order of magnitude faster.
 * Requesting the opening bytes of the neighbouring clips moves that cost off the
 * moment the visitor presses next.
 *
 * Only the neighbours, never the whole grid: prefetching every visible card
 * would download tens of megabytes of clips nobody asked for. Skipped entirely
 * when the visitor has asked the browser to save data.
 */
export function usePrefetchGoals(
  goals: readonly (GoalVideo | undefined)[],
  compact: boolean,
): void {
  const urls = goals
    .filter((goal): goal is GoalVideo => goal !== undefined)
    .map((goal) => selectGoalPlaybackUrl(goal, compact))
  const key = urls.join('|')

  useEffect(() => {
    if (key.length === 0 || prefersLessData()) return

    const controller = new AbortController()
    for (const url of key.split('|')) {
      void fetch(url, {
        signal: controller.signal,
        headers: { Range: `bytes=0-${String(PREFETCH_BYTES - 1)}` },
      }).catch(() => {
        // A failed warm-up is not an error: the clip still loads on demand.
      })
    }

    return () => {
      controller.abort()
    }
  }, [key])
}
