import { describe, expect, it } from 'vitest'

import {
  buildGoalCompetition,
  buildGoalId,
  buildGoalPublicId,
  buildGoalScorer,
  parseGoalFileName,
} from './goal-file-parser'

const HASH_A = 'a4d938b817fc1122334455667788990011223344556677889900aabbccddeeff'
const HASH_B = 'ffeeddccbbaa00998877665544332211009988776655443322110cf718b839d4'

describe('parseGoalFileName (canonical convention)', () => {
  it('reads the competition and the scorer from the three segments', () => {
    expect(parseGoalFileName('apertura-2026__lorenzo-minervino__gol-01.mp4')).toEqual({
      competitionName: 'Apertura 2026',
      scorerName: 'Lorenzo Minervino',
      convention: 'canonical',
    })
  })

  it('ignores the third segment whatever it is', () => {
    const numbered = parseGoalFileName('apertura-2026__lorenzo-minervino__gol-01.mp4')
    const labelled = parseGoalFileName('apertura-2026__lorenzo-minervino__segundo-tiempo.mp4')
    const dated = parseGoalFileName('apertura-2026__lorenzo-minervino__2026-03-14.mp4')
    expect(labelled).toEqual(numbered)
    expect(dated).toEqual(numbered)
  })

  it('reads a friendly and a preseason competition', () => {
    expect(parseGoalFileName('amistoso__agus-lorenzo__clip-a.mov')?.competitionName).toBe(
      'Amistoso',
    )
    expect(parseGoalFileName('pretemporada-2026__martin-perez__uno.mp4')?.competitionName).toBe(
      'Pretemporada 2026',
    )
  })

  it('restores an accented scorer through the alias', () => {
    expect(parseGoalFileName('apertura-2025__santiago-penonori__gol-01.mp4')?.scorerName).toBe(
      'Santiago Peñoñori',
    )
  })

  it('normalises the own-goal marker', () => {
    expect(parseGoalFileName('clausura-2023__en-contra__gol-01.mp4')?.scorerName).toBe('En contra')
  })

  it('rejects a name with the wrong number of segments', () => {
    expect(parseGoalFileName('apertura-2026__lorenzo-minervino.mp4')).toBeUndefined()
    expect(parseGoalFileName('apertura-2026__lorenzo-minervino__a__b.mp4')).toBeUndefined()
  })
})

describe('parseGoalFileName (legacy convention)', () => {
  it('reads the competition and the scorer', () => {
    expect(parseGoalFileName('Apertura_2026-Lorenzo_Minervino-0.mp4')).toEqual({
      competitionName: 'Apertura 2026',
      scorerName: 'Lorenzo Minervino',
      convention: 'legacy',
    })
  })

  it('ignores the trailing index, whatever its width', () => {
    const single = parseGoalFileName('Clausura_2023-Lautaro_Mariani-7.mp4')
    const padded = parseGoalFileName('Clausura_2023-Lautaro_Mariani-07.mp4')
    expect(single).toEqual(padded)
  })

  it('keeps a four-digit year that belongs to the competition name', () => {
    expect(parseGoalFileName('Apertura_2022-Francisco_Garcia-0.mp4')?.competitionName).toBe(
      'Apertura 2022',
    )
  })

  it('reads a friendly', () => {
    expect(parseGoalFileName('Amistoso_2024-Ary_Martinez-0.mp4')?.competitionName).toBe(
      'Amistoso 2024',
    )
  })

  it('reads a preseason competition', () => {
    expect(parseGoalFileName('Pretemporada_2026-Leandro_Castillo-3.mp4')?.competitionName).toBe(
      'Pretemporada 2026',
    )
  })

  it('restores an accented scorer name through the alias', () => {
    expect(parseGoalFileName('Apertura_2025-Santiago_Penonori-0.mp4')?.scorerName).toBe(
      'Santiago Peñoñori',
    )
  })

  it('normalises the own-goal marker', () => {
    expect(parseGoalFileName('Clausura_2023-En_Contra-0.mp4')?.scorerName).toBe('En contra')
  })

  it('accepts any supported extension, including uppercase', () => {
    expect(parseGoalFileName('Apertura_2026-Lorenzo_Minervino-0.MOV')).toEqual({
      competitionName: 'Apertura 2026',
      scorerName: 'Lorenzo Minervino',
      convention: 'legacy',
    })
  })

  it('reports an unparseable name instead of guessing', () => {
    expect(parseGoalFileName('golazo.mp4')).toBeUndefined()
    expect(parseGoalFileName('Apertura_2026-Lorenzo_Minervino.mp4')).toBeUndefined()
  })
})

describe('buildGoalCompetition', () => {
  it('links an official competition to its championship', () => {
    const competition = buildGoalCompetition('f8', 'Apertura 2026')
    expect(competition.type).toBe('official')
    expect(competition.championshipId).toBe('f8-apertura-2026')
  })

  it('gives a friendly no championship', () => {
    const competition = buildGoalCompetition('f8', 'Amistoso 2024')
    expect(competition.type).toBe('friendly')
    expect(competition.championshipId).toBeUndefined()
  })

  it('gives preseason no championship', () => {
    const competition = buildGoalCompetition('f5', 'Pretemporada 2026')
    expect(competition.type).toBe('preseason')
    expect(competition.championshipId).toBeUndefined()
  })

  it('namespaces a shared competition name by format', () => {
    expect(buildGoalCompetition('f8', 'Apertura 2026').id).toBe('f8-apertura-2026')
    expect(buildGoalCompetition('f5', 'Apertura 2026').id).toBe('f5-apertura-2026')
  })
})

describe('buildGoalScorer', () => {
  it('produces a url-safe slug from an accented name', () => {
    expect(buildGoalScorer('Santiago Peñoñori').slug).toBe('santiago-penonori')
  })
})

describe('goal identity', () => {
  it('is deterministic for the same content', () => {
    expect(buildGoalId('f8', HASH_A)).toBe(buildGoalId('f8', HASH_A))
  })

  it('does not depend on the file name', () => {
    expect(buildGoalId('f8', HASH_A)).toBe('f8-a4d938b817fc')
  })

  it('differs between formats for identical content', () => {
    expect(buildGoalId('f8', HASH_A)).not.toBe(buildGoalId('f5', HASH_A))
  })

  it('differs for different content', () => {
    expect(buildGoalId('f8', HASH_A)).not.toBe(buildGoalId('f8', HASH_B))
  })
})

describe('buildGoalPublicId', () => {
  it('builds a deterministic, url-safe public id', () => {
    const competition = buildGoalCompetition('f8', 'Apertura 2026')
    const scorer = buildGoalScorer('Santiago Peñoñori')
    expect(buildGoalPublicId(competition, scorer, HASH_A)).toBe(
      'solares/goals/f8/apertura-2026/santiago-penonori-a4d938b817fc',
    )
  })

  it('never contains spaces or accents', () => {
    const competition = buildGoalCompetition('f5', 'Pretemporada 2026')
    const scorer = buildGoalScorer('Santiago Peñoñori')
    const publicId = buildGoalPublicId(competition, scorer, HASH_B)
    expect(publicId).toMatch(/^[a-z0-9/-]+$/)
  })
})
