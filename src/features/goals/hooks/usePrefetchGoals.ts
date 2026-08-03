import { useEffect } from 'react'

import type { GoalVideo } from '../types/goals'
import { selectGoalPlaybackUrl } from '../utils/selectGoalPlaybackUrl'

const PREFETCH_BYTES = 262_144

type ConnectionInfo = { saveData?: boolean }

function prefersLessData(): boolean {
  const connection = (navigator as Navigator & { connection?: ConnectionInfo }).connection
  return connection?.saveData === true
}

/**
 * A first view pays for a cold CDN edge, which is most of the wait. Only the
 * neighbours: prefetching the grid would cost tens of megabytes. Skipped when
 * the visitor asked the browser to save data.
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
      }).catch(() => {})
    }

    return () => {
      controller.abort()
    }
  }, [key])
}
