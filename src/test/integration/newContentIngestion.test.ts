import { describe, expect, it } from 'vitest'

import {
  buildGoalCompetition,
  buildGoalScorer,
  parseGoalFileName,
} from '../../../scripts/goals/goal-file-parser'
import { mapChampionships } from '@/features/championships/mappers/mapChampionships'
import { resolveChampionshipAssets } from '@/features/championships/utils/resolveChampionshipAssets'
import type { SheetData, SheetRow } from '@/features/championships/utils/readSheetTable'
import { selectGoalsByChampionship } from '@/features/goals/selectors/selectFilteredGoals'
import type { GoalVideo } from '@/features/goals/types/goals'

/**
 * Proves the growth path end to end with fixtures only: a championship that does
 * not exist yet is added to the spreadsheet, then its media, then a goal — and
 * none of those steps requires a component change.
 *
 * Nothing here touches Google Sheets, Cloudinary or the production dataset.
 */

type Cell = Readonly<Record<string, string | number>>

function sheet(headers: readonly string[], records: readonly Cell[]): SheetData {
  const rows: SheetRow[] = records.map((record, index) => ({
    index,
    cells: new Map(Object.entries(record).map(([key, value]) => [key, { v: value }])),
  }))
  return { headers, rows }
}

const SUMMARY_HEADERS = ['Campeonato', 'Torneo', 'Resultado', 'Link Final'] as const
const MATCH_HEADERS = [
  'Rival',
  'Resultado',
  'Goles a favor',
  'Goles encontra',
  'Sede',
  'Torneo',
  'Fase',
  'Goleadores',
  'Fecha',
  'Hora',
] as const

const NEW_NAME = 'Apertura 2028'
const NEW_ID = 'f8-apertura-2028'
const NEW_SLUG = 'apertura-2028'

function newChampionshipSheets() {
  const summary = sheet(SUMMARY_HEADERS, [
    { Campeonato: NEW_NAME, Torneo: 'TdeA', Resultado: 'Campeón', 'Link Final': '' },
  ])
  const matches = sheet(MATCH_HEADERS, [
    {
      Rival: 'Bong',
      Resultado: 'Victoria',
      'Goles a favor': 4,
      'Goles encontra': 1,
      Sede: 'GEBA',
      Torneo: NEW_NAME,
      Fase: 'Regular',
      Goleadores: 'Lorenzo Minervino, Lorenzo Minervino',
      Fecha: 'Date(2028,2,14)',
      Hora: '22:00:00',
    },
    {
      Rival: 'Pampa',
      Resultado: 'Empate',
      'Goles a favor': 2,
      'Goles encontra': 2,
      Sede: 'GEBA',
      Torneo: NEW_NAME,
      Fase: 'Final',
      Goleadores: 'Santiago Peñoñori, En Contra',
      Fecha: 'Date(2028,3,21)',
      Hora: '21:00:00',
    },
  ])
  return mapChampionships('f8', summary, matches)
}

describe('a new championship arriving from the spreadsheet', () => {
  it('is discovered with a stable, format-namespaced id and slug', () => {
    const championships = newChampionshipSheets()

    expect(championships).toContainEqual(
      expect.objectContaining({ id: NEW_ID, slug: NEW_SLUG, name: NEW_NAME, format: 'f8' }),
    )
  })

  it('is published and carries its matches, scorers and statistics', () => {
    const championship = newChampionshipSheets().find((entry) => entry.id === NEW_ID)

    expect(championship?.published).toBe(true)
    expect(championship?.matches.length).toBeGreaterThan(0)
    expect(championship?.scorers.length).toBeGreaterThan(0)
    expect(championship?.stats.played).toBe(2)
    expect(championship?.stats.goalsFor).toBe(6)
  })

  it('keeps the statistics invariants', () => {
    const stats = newChampionshipSheets().find((entry) => entry.id === NEW_ID)?.stats

    expect(stats?.played).toBe((stats?.won ?? 0) + (stats?.drawn ?? 0) + (stats?.lost ?? 0))
    expect(stats?.goalDifference).toBe((stats?.goalsFor ?? 0) - (stats?.goalsAgainst ?? 0))
  })

  it('never collides with the same name in the other format', () => {
    const f5 = mapChampionships(
      'f5',
      sheet(SUMMARY_HEADERS, [
        { Campeonato: NEW_NAME, Torneo: 'TdeA', Resultado: '', 'Link Final': '' },
      ]),
      sheet(MATCH_HEADERS, []),
    )

    expect(f5[0]?.id).toBe('f5-apertura-2028')
    expect(f5[0]?.id).not.toBe(NEW_ID)
  })

  it('resolves to placeholders while it has no media, instead of borrowing another photo', () => {
    const assets = resolveChampionshipAssets({
      id: NEW_ID,
      format: 'f8',
      name: NEW_NAME,
      league: 'TdeA',
    })

    expect(assets.teamPhoto).toBeUndefined()
    expect(assets.teamPhotoWebp).toBeUndefined()
    // The league logo is shared, so an existing league resolves one immediately;
    // what must never happen is inheriting another championship's team photo.
    expect(assets.tournamentLogo).not.toBe(undefined)
  })

  it('resolves no logo at all for a league that has none', () => {
    const assets = resolveChampionshipAssets({
      id: NEW_ID,
      format: 'f8',
      name: NEW_NAME,
      league: 'Liga Inexistente',
    })

    expect(assets.tournamentLogo).toBeUndefined()
    expect(assets.teamPhoto).toBeUndefined()
  })
})

describe('a goal recorded for that new championship', () => {
  const FILE_NAME = 'apertura-2028__lorenzo-minervino__gol-01.mp4'

  it('is parsed from the canonical file name', () => {
    expect(parseGoalFileName(FILE_NAME)).toEqual({
      competitionName: NEW_NAME,
      scorerName: 'Lorenzo Minervino',
      convention: 'canonical',
    })
  })

  it('maps to the championship discovered from the spreadsheet', () => {
    const parsed = parseGoalFileName(FILE_NAME)
    const competition = buildGoalCompetition('f8', parsed?.competitionName ?? '')
    const discovered = newChampionshipSheets().find((entry) => entry.id === NEW_ID)

    expect(competition.type).toBe('official')
    expect(competition.championshipId).toBe(discovered?.id)
  })

  it('belongs to the folder format, not to the file name', () => {
    const f8 = buildGoalCompetition('f8', NEW_NAME)
    const f5 = buildGoalCompetition('f5', NEW_NAME)

    expect(f8.championshipId).toBe('f8-apertura-2028')
    expect(f5.championshipId).toBe('f5-apertura-2028')
  })

  it('appears in the championship gallery without any component change', () => {
    const parsed = parseGoalFileName(FILE_NAME)
    const competition = buildGoalCompetition('f8', parsed?.competitionName ?? '')
    const scorer = buildGoalScorer(parsed?.scorerName ?? '')

    const goal = {
      id: 'f8-abcdef012345',
      format: 'f8',
      scorer,
      competition,
      cloudinary: {
        publicId: `solares/goals/f8/${NEW_SLUG}/${scorer.slug}-abcdef012345`,
        format: 'mp4',
        resourceType: 'video',
        secureUrl: 'https://res.cloudinary.com/demo/video/upload/a.mp4',
        playbackUrl: 'https://res.cloudinary.com/demo/video/upload/a.mp4',
        posterUrl: 'https://res.cloudinary.com/demo/video/upload/a.jpg',
        downloadUrl: 'https://res.cloudinary.com/demo/video/upload/a.mp4',
      },
      media: { bytes: 1024 },
      source: { fileName: FILE_NAME, createdAt: '2028-03-14T00:00:00.000Z', hash: 'abcdef012345' },
    } as const satisfies GoalVideo

    expect(selectGoalsByChampionship([goal], 'f8', NEW_ID)).toHaveLength(1)
    expect(selectGoalsByChampionship([goal], 'f5', NEW_ID)).toHaveLength(0)
  })

  it('keeps a friendly and a preseason clip out of every championship', () => {
    expect(buildGoalCompetition('f8', 'Amistoso 2028').championshipId).toBeUndefined()
    expect(buildGoalCompetition('f8', 'Pretemporada 2028').championshipId).toBeUndefined()
  })
})
