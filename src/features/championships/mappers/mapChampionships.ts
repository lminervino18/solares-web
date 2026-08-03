import type {
  Championship,
  ChampionshipStatus,
  FootballFormat,
  Match,
  YouTubeVideo,
} from '../types/championships'
import { CHAMPIONSHIP_ALIASES, findChampionshipOverride } from '../data/championship-overrides'
import { calculateChampionshipStats } from '../utils/calculateChampionshipStats'
import { mapChampionshipHonor } from '../utils/mapChampionshipHonor'
import { slugify } from '../utils/normalizeCellValue'
import { parseGoalscorers } from '../utils/parseGoalscorers'
import { parseSeasonName } from '../utils/parseSeasonName'
import { parseYouTubeUrl } from '../utils/parseYouTubeUrl'
import { readString, type SheetData } from '../utils/readSheetTable'
import { mapMatches, type RawMatch } from './mapMatches'
import { mapScorers } from './mapScorers'

const SUMMARY_HEADERS = {
  name: 'Campeonato',
  league: 'Torneo',
  result: 'Resultado',
  video: 'Link Final',
} as const

type SummaryMeta = {
  readonly displayName: string
  readonly league?: string
  readonly resultLabel?: string
  readonly videoRaw?: string
}

type ChampionshipGroup = {
  displayName: string
  published: boolean
  league?: string
  resultLabel?: string
  videoRaw?: string
  matches: RawMatch[]
}

function resolveAlias(name: string): string {
  const normalized = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
  return CHAMPIONSHIP_ALIASES[normalized] ?? name
}

function readSummary(sheet: SheetData): Map<string, SummaryMeta> {
  const summary = new Map<string, SummaryMeta>()
  for (const row of sheet.rows) {
    const rawName = readString(row, SUMMARY_HEADERS.name)
    if (!rawName) continue
    const displayName = resolveAlias(rawName)
    const league = readString(row, SUMMARY_HEADERS.league)
    const resultLabel = readString(row, SUMMARY_HEADERS.result)
    const videoRaw = readString(row, SUMMARY_HEADERS.video)
    summary.set(slugify(displayName), {
      displayName,
      ...(league ? { league } : {}),
      ...(resultLabel ? { resultLabel } : {}),
      ...(videoRaw ? { videoRaw } : {}),
    })
  }
  return summary
}

function resolveStatus(
  resultLabel: string | undefined,
  matches: readonly Match[],
): ChampionshipStatus {
  if (resultLabel) return 'completed'
  if (matches.some((match) => match.isFinal)) return 'completed'
  if (matches.length > 0) return 'in-progress'
  return 'scheduled'
}

function buildMatch(raw: RawMatch, championshipId: string, format: FootballFormat): Match {
  return {
    id: `${championshipId}-m${raw.sourceOrder}`,
    championshipId,
    format,
    sourceOrder: raw.sourceOrder,
    opponent: raw.opponent,
    outcome: raw.outcome,
    isFinal: raw.isFinal,
    scorers: parseGoalscorers(raw.scorersRaw),
    ...(raw.date ? { date: raw.date } : {}),
    ...(raw.time ? { time: raw.time } : {}),
    ...(raw.stage ? { stage: raw.stage } : {}),
    ...(raw.venue ? { venue: raw.venue } : {}),
    ...(raw.goalsFor !== undefined ? { goalsFor: raw.goalsFor } : {}),
    ...(raw.goalsAgainst !== undefined ? { goalsAgainst: raw.goalsAgainst } : {}),
    ...(raw.scoreLabel ? { scoreLabel: raw.scoreLabel } : {}),
  }
}

function stageRank(stage: string | undefined): number {
  if (!stage) return 0
  const value = stage.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  // "semifinal" contains "final", so it must be checked first.
  if (value.includes('semifinal')) return 3
  if (value.includes('cuarto')) return 2
  if (value.includes('octavo')) return 1
  if (value.includes('final')) return 4
  return 0
}

/** Stage before date, so a mis-dated knockout match still reads in tournament order. */
function sortMatches(a: Match, b: Match): number {
  const rankDelta = stageRank(a.stage) - stageRank(b.stage)
  if (rankDelta !== 0) return rankDelta
  if (a.date && b.date) {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
  } else if (a.date) {
    return -1
  } else if (b.date) {
    return 1
  }
  return a.sourceOrder - b.sourceOrder
}

export function mapChampionships(
  format: FootballFormat,
  summarySheet: SheetData,
  matchesSheet: SheetData,
): readonly Championship[] {
  const summary = readSummary(summarySheet)
  const rawMatches = mapMatches(matchesSheet)

  const groups = new Map<string, ChampionshipGroup>()

  for (const [key, meta] of summary) {
    groups.set(key, { ...meta, published: true, matches: [] })
  }

  for (const raw of rawMatches) {
    const displayName = resolveAlias(raw.championshipName)
    const key = slugify(displayName)
    const existing = groups.get(key)
    if (existing) {
      existing.matches.push(raw)
    } else {
      // A championship present only in the matches sheet (not the summary), e.g.
      // an in-progress "Verano" edition. It is kept as unpublished: excluded
      // from the Campeonatos section and from title counts, but its matches
      // still feed the pooled statistics.
      groups.set(key, { displayName, published: false, matches: [raw] })
    }
  }

  const championships: Championship[] = []

  for (const [key, group] of groups) {
    const id = `${format}-${key}`
    const override = findChampionshipOverride(format, group.displayName)

    const matches = group.matches.map((raw) => buildMatch(raw, id, format)).sort(sortMatches)
    const scorers = mapScorers(group.matches, id, format)
    const stats = calculateChampionshipStats(matches)
    const honor = mapChampionshipHonor(group.resultLabel)
    const { season, year, recency } = parseSeasonName(group.displayName)

    const videoRaw = override?.videoUrl ?? group.videoRaw
    const finalVideo: YouTubeVideo | undefined = parseYouTubeUrl(videoRaw)

    championships.push({
      id,
      slug: key,
      format,
      name: group.displayName,
      published: group.published,
      ...(override?.shortName ? { shortName: override.shortName } : {}),
      ...(year !== undefined ? { year } : {}),
      ...(season ? { season } : {}),
      ...(group.league ? { league: group.league } : {}),
      status: resolveStatus(group.resultLabel, matches),
      ...(group.resultLabel ? { resultLabel: group.resultLabel } : {}),
      honorType: honor.honorType,
      trophyTier: override?.trophyTier ?? honor.trophyTier,
      sourceOrder: override?.order ?? recency,
      matches,
      scorers,
      stats,
      assets: {},
      ...(finalVideo ? { finalVideo } : {}),
    })
  }

  return championships.sort(
    (a, b) => b.sourceOrder - a.sourceOrder || a.name.localeCompare(b.name, 'es'),
  )
}
