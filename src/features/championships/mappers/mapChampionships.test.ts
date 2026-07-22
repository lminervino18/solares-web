import { describe, expect, it } from 'vitest'

import type { SheetData, SheetRow } from '../utils/readSheetTable'
import { mapChampionships } from './mapChampionships'

type Record_ = Readonly<Record<string, string | number>>

function sheet(headers: readonly string[], records: readonly Record_[]): SheetData {
  const rows: SheetRow[] = records.map((record, index) => {
    const cells = new Map(Object.entries(record).map(([key, value]) => [key, { v: value }]))
    return { index, cells }
  })
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

function matchRecord(torneo: string, partial: Record_ = {}): Record_ {
  return {
    Rival: 'Rival',
    Resultado: 'Victoria',
    'Goles a favor': 3,
    'Goles encontra': 1,
    Sede: 'GEBA',
    Torneo: torneo,
    Fase: 'Regular',
    Goleadores: 'Lorenzo Minervino',
    Fecha: 'Date(2025,3,4)',
    Hora: '22:00:00',
    ...partial,
  }
}

describe('mapChampionships', () => {
  it('publishes summary championships and keeps match-only ones unpublished', () => {
    const summary = sheet(SUMMARY_HEADERS, [
      { Campeonato: 'Clausura 2025', Torneo: 'TdeA', Resultado: 'Finalista', 'Link Final': '' },
      { Campeonato: 'Apertura 2026', Torneo: 'DePrimera', Resultado: 'Campeón', 'Link Final': '' },
    ])
    const matches = sheet(MATCH_HEADERS, [
      matchRecord('Clausura 2025'),
      matchRecord('Apertura 2026'),
      matchRecord('Verano 2026'),
    ])

    const championships = mapChampionships('f5', summary, matches)
    const published = Object.fromEntries(championships.map((c) => [c.name, c.published]))

    expect(published['Clausura 2025']).toBe(true)
    expect(published['Apertura 2026']).toBe(true)
    // Verano is present (its matches feed the statistics) but unpublished, so it
    // is excluded from the Campeonatos section and from title counts.
    expect(published['Verano 2026']).toBe(false)
  })

  it('namespaces ids by format so a shared name does not collide', () => {
    const summary = sheet(SUMMARY_HEADERS, [
      { Campeonato: 'Clausura 2025', Torneo: 'TdeA', Resultado: 'Finalista', 'Link Final': '' },
    ])
    const matches = sheet(MATCH_HEADERS, [matchRecord('Clausura 2025')])

    const f8 = mapChampionships('f8', summary, matches)
    const f5 = mapChampionships('f5', summary, matches)

    expect(f8[0]?.id).toBe('f8-clausura-2025')
    expect(f5[0]?.id).toBe('f5-clausura-2025')
    expect(f8[0]?.format).toBe('f8')
    expect(f5[0]?.format).toBe('f5')
  })

  it('shows a summary championship with no matches as partial data', () => {
    const summary = sheet(SUMMARY_HEADERS, [
      { Campeonato: 'Apertura 2026', Torneo: 'DePrimera', Resultado: '', 'Link Final': '' },
    ])
    const matches = sheet(MATCH_HEADERS, [])

    const [championship] = mapChampionships('f8', summary, matches)
    expect(championship?.name).toBe('Apertura 2026')
    expect(championship?.matches).toHaveLength(0)
    expect(championship?.stats.played).toBe(0)
    expect(championship?.status).toBe('scheduled')
  })

  it('orders matches by stage so a mis-dated final still comes last', () => {
    const summary = sheet(SUMMARY_HEADERS, [
      { Campeonato: 'Apertura 2025', Torneo: 'TdeA', Resultado: 'Finalista', 'Link Final': '' },
    ])
    const matches = sheet(MATCH_HEADERS, [
      matchRecord('Apertura 2025', { Fase: 'Semifinal', Fecha: 'Date(2025,6,27)' }),
      // Final dated before the semifinal (a sheet typo): stage must still win.
      matchRecord('Apertura 2025', { Rival: 'Bong', Fase: 'Final', Fecha: 'Date(2025,6,4)' }),
      matchRecord('Apertura 2025', { Fase: 'Regular', Fecha: 'Date(2025,3,14)' }),
    ])

    const [championship] = mapChampionships('f8', summary, matches)
    const stages = championship?.matches.map((m) => m.stage)
    expect(stages).toEqual(['Regular', 'Semifinal', 'Final'])
    expect(championship?.matches.at(-1)?.opponent).toBe('Bong')
  })

  it('parses the final video from the summary and sorts most recent first', () => {
    const summary = sheet(SUMMARY_HEADERS, [
      {
        Campeonato: 'Clausura 2023',
        Torneo: 'Torneos Indiana',
        Resultado: 'Campeón',
        'Link Final': 'https://www.youtube.com/watch?v=6EctDXbNgxs',
      },
      {
        Campeonato: 'Apertura 2022',
        Torneo: 'Torneos Indiana',
        Resultado: 'Finalista',
        'Link Final': '',
      },
    ])
    const matches = sheet(MATCH_HEADERS, [
      matchRecord('Clausura 2023'),
      matchRecord('Apertura 2022'),
    ])

    const championships = mapChampionships('f8', summary, matches)
    expect(championships[0]?.name).toBe('Clausura 2023')
    expect(championships[0]?.finalVideo?.videoId).toBe('6EctDXbNgxs')
    expect(championships[1]?.name).toBe('Apertura 2022')
  })
})
