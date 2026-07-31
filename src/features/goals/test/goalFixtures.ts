import type { GoalCompetitionType, GoalFormat, GoalVideo } from '../types/goals'

/**
 * Deterministic goal fixtures. Tests never touch the generated manifest or a
 * live Cloudinary account.
 */

type GoalOverrides = {
  readonly id?: string
  readonly format?: GoalFormat
  readonly scorerName?: string
  readonly competitionName?: string
  readonly competitionType?: GoalCompetitionType
  readonly championshipId?: string | null
  readonly createdAt?: string
  readonly duration?: number
}

function slug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function makeGoal(overrides: GoalOverrides = {}): GoalVideo {
  const format = overrides.format ?? 'f8'
  const scorerName = overrides.scorerName ?? 'Lorenzo Minervino'
  const competitionName = overrides.competitionName ?? 'Apertura 2026'
  const competitionSlug = slug(competitionName)
  const scorerSlug = slug(scorerName)
  const type = overrides.competitionType ?? 'official'
  const id = overrides.id ?? `${format}-${competitionSlug}-${scorerSlug}`
  const championshipId =
    overrides.championshipId === null
      ? undefined
      : (overrides.championshipId ??
        (type === 'official' ? `${format}-${competitionSlug}` : undefined))
  const publicId = `solares/goals/${format}/${competitionSlug}/${scorerSlug}`

  return {
    id,
    format,
    scorer: { id: scorerSlug, slug: scorerSlug, name: scorerName },
    competition: {
      id: `${format}-${competitionSlug}`,
      slug: competitionSlug,
      name: competitionName,
      format,
      type,
      ...(championshipId === undefined ? {} : { championshipId }),
    },
    cloudinary: {
      publicId,
      format: 'mp4',
      resourceType: 'video',
      secureUrl: `https://res.cloudinary.com/test/video/upload/${publicId}.mp4`,
      playbackUrl: `https://res.cloudinary.com/test/video/upload/q_auto/${publicId}.mp4`,
      posterUrl: `https://res.cloudinary.com/test/video/upload/so_auto/${publicId}.jpg`,
      downloadUrl: `https://res.cloudinary.com/test/video/upload/fl_attachment/${publicId}.mp4`,
    },
    media: {
      bytes: 1_000_000,
      width: 720,
      height: 720,
      ...(overrides.duration === undefined ? {} : { duration: overrides.duration }),
    },
    source: {
      fileName: `${competitionName.replace(/ /g, '_')}-${scorerName.replace(/ /g, '_')}-0.mp4`,
      createdAt: overrides.createdAt ?? '2026-07-30T12:00:00.000Z',
      hash: id,
    },
  }
}

export const goalFixtures: readonly GoalVideo[] = [
  makeGoal({ id: 'f8-a1', competitionName: 'Apertura 2026', scorerName: 'Lorenzo Minervino' }),
  makeGoal({ id: 'f8-a2', competitionName: 'Apertura 2026', scorerName: 'Lorenzo Minervino' }),
  makeGoal({ id: 'f8-b1', competitionName: 'Clausura 2025', scorerName: 'Geronimo Heller' }),
  makeGoal({
    id: 'f8-c1',
    competitionName: 'Amistoso 2024',
    competitionType: 'friendly',
    scorerName: 'Ary Martinez',
  }),
  makeGoal({
    id: 'f5-a1',
    format: 'f5',
    competitionName: 'Apertura 2026',
    scorerName: 'Lucas Iriarte',
  }),
  makeGoal({
    id: 'f5-p1',
    format: 'f5',
    competitionName: 'Pretemporada 2026',
    competitionType: 'preseason',
    scorerName: 'Santiago Peñoñori',
  }),
]
