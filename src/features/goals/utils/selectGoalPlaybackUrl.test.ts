import { describe, expect, it } from 'vitest'

import type { GoalVideo } from '../types/goals'
import { goalFixtures } from '../test/goalFixtures'
import { selectGoalPlaybackUrl } from './selectGoalPlaybackUrl'

const FULL = 'https://res.cloudinary.com/demo/video/upload/f_auto,q_auto/goal.mp4'
const COMPACT = 'https://res.cloudinary.com/demo/video/upload/c_limit,f_auto,q_auto,w_720/goal.mp4'

function goal(overrides: Partial<GoalVideo['cloudinary']>): GoalVideo {
  const base = goalFixtures[0]
  if (base === undefined) throw new Error('goalFixtures is empty')
  return {
    ...base,
    cloudinary: { ...base.cloudinary, playbackUrl: FULL, ...overrides },
  }
}

describe('selectGoalPlaybackUrl', () => {
  it('serves the full rendition on a wide viewport', () => {
    expect(selectGoalPlaybackUrl(goal({ compactPlaybackUrl: COMPACT }), false)).toBe(FULL)
  })

  it('serves the width-capped rendition on a narrow viewport', () => {
    expect(selectGoalPlaybackUrl(goal({ compactPlaybackUrl: COMPACT }), true)).toBe(COMPACT)
  })

  it('falls back to the full rendition when the manifest predates the compact one', () => {
    const legacy = goal({})
    const { compactPlaybackUrl: _omitted, ...cloudinary } = legacy.cloudinary
    expect(selectGoalPlaybackUrl({ ...legacy, cloudinary }, true)).toBe(FULL)
  })
})
