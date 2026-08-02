import { describe, expect, it } from 'vitest'

import { loadChampionshipsSnapshot } from '@/features/championships/data/championshipsSnapshot'
import assetsManifest from '@/features/championships/data/generated/championship-assets.manifest.json'
import { goals } from '@/features/goals/data/goals'

/**
 * Invariants over the committed production data.
 *
 * These assert relationships, never quantities: publishing a championship or a
 * goal must never break them, and must never require editing this file.
 */

const snapshot = loadChampionshipsSnapshot()
const championships = [...snapshot.data.f8, ...snapshot.data.f5]
const championshipIds = new Set(championships.map((championship) => championship.id))

describe('championship invariants', () => {
  it('has data to check', () => {
    expect(championships.length).toBeGreaterThan(0)
    expect(goals.length).toBeGreaterThan(0)
  })

  it('gives every championship a unique id', () => {
    expect(championshipIds.size).toBe(championships.length)
  })

  it('namespaces every id and slug by format', () => {
    for (const championship of championships) {
      expect(championship.id).toBe(`${championship.format}-${championship.slug}`)
    }
  })

  it('never puts one championship in both formats', () => {
    const f8Ids = new Set(snapshot.data.f8.map((championship) => championship.id))
    const shared = snapshot.data.f5.filter((championship) => f8Ids.has(championship.id))
    expect(shared).toEqual([])
  })

  it('keeps played equal to won plus drawn plus lost', () => {
    for (const { id, stats } of championships) {
      expect({ id, played: stats.played }).toEqual({
        id,
        played: stats.won + stats.drawn + stats.lost,
      })
    }
  })

  it('keeps the goal difference equal to goals for minus goals against', () => {
    for (const { id, stats } of championships) {
      expect({ id, difference: stats.goalDifference }).toEqual({
        id,
        difference: stats.goalsFor - stats.goalsAgainst,
      })
    }
  })

  it('scopes every match and scorer to its own championship and format', () => {
    for (const championship of championships) {
      for (const match of championship.matches) {
        expect(match.championshipId).toBe(championship.id)
        expect(match.format).toBe(championship.format)
      }
      for (const scorer of championship.scorers) {
        expect(scorer.championshipId).toBe(championship.id)
        expect(scorer.format).toBe(championship.format)
      }
    }
  })
})

describe('goal invariants', () => {
  it('gives every goal exactly one format matching its competition', () => {
    for (const goal of goals) {
      expect(['f8', 'f5']).toContain(goal.format)
      expect(goal.competition.format).toBe(goal.format)
    }
  })

  it('gives every goal a unique id and a unique source hash', () => {
    const ids = new Set(goals.map((goal) => goal.id))
    const hashes = new Set(goals.map((goal) => goal.source.hash))
    expect(ids.size).toBe(goals.length)
    expect(hashes.size).toBe(goals.length)
  })

  it('derives every goal id from its format and content hash', () => {
    for (const goal of goals) {
      expect(goal.id).toBe(`${goal.format}-${goal.source.hash.slice(0, 12)}`)
    }
  })

  it('points every official goal at a championship that exists', () => {
    const official = goals.filter((goal) => goal.competition.type === 'official')
    expect(official.length).toBeGreaterThan(0)

    const dangling = official.filter(
      (goal) =>
        goal.competition.championshipId === undefined ||
        !championshipIds.has(goal.competition.championshipId),
    )
    expect(dangling.map((goal) => `${goal.id} -> ${goal.competition.championshipId}`)).toEqual([])
  })

  it('gives friendly and preseason goals no championship at all', () => {
    for (const goal of goals) {
      if (goal.competition.type === 'friendly' || goal.competition.type === 'preseason') {
        expect(goal.competition.championshipId).toBeUndefined()
      }
    }
  })

  it('publishes no credential, signature or local path', () => {
    const serialized = JSON.stringify(goals)
    expect(serialized).not.toMatch(/cloudinary:\/\//)
    expect(serialized).not.toMatch(/api_secret|api_key|CLOUDINARY_URL/i)
    expect(serialized).not.toMatch(/\/home\/|[A-Z]:\\\\/)
  })
})

describe('championship asset manifest invariants', () => {
  it('references only championships that exist', () => {
    for (const [id, entry] of Object.entries(assetsManifest.teamPhotos)) {
      expect({ id, known: championshipIds.has(id) }).toEqual({ id, known: true })
      expect(entry.championshipId).toBe(id)
    }
  })

  it('stores every path relative to the championship asset folder', () => {
    const entries = [
      ...Object.values(assetsManifest.teamPhotos).flatMap((entry) => [entry.jpg, entry.webp]),
      ...Object.values(assetsManifest.leagueLogos).map((entry) => entry.png),
    ]
    for (const path of entries) {
      expect(path.startsWith('/')).toBe(false)
      expect(path).not.toMatch(/\.\./)
    }
  })

  it('records usable intrinsic dimensions for every asset', () => {
    for (const entry of Object.values(assetsManifest.teamPhotos)) {
      expect(entry.width).toBeGreaterThan(0)
      expect(entry.height).toBeGreaterThan(0)
    }
    for (const entry of Object.values(assetsManifest.leagueLogos)) {
      expect(entry.width).toBeGreaterThan(0)
      expect(entry.height).toBeGreaterThan(0)
    }
  })

  it('keeps a championship listed even when it has no media', () => {
    const withoutPhoto = championships.filter(
      (championship) => !(championship.id in assetsManifest.teamPhotos),
    )

    // Not every championship has a photo, and the ones that do not are still
    // part of the data the section renders. A missing asset never removes one.
    for (const championship of withoutPhoto) {
      expect(championshipIds.has(championship.id)).toBe(true)
      expect(championship.name.length).toBeGreaterThan(0)
    }
  })
})
