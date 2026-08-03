import Fuse, { type IFuseOptions } from 'fuse.js'

import type { GoalScorerOption } from '../selectors/selectGoalScorerOptions'

type SearchableScorer = GoalScorerOption & {
  readonly searchName: string
  readonly lastName: string
}

const FUSE_OPTIONS: IFuseOptions<SearchableScorer> = {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'searchName', weight: 2 },
    { name: 'lastName', weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
}

export function normalizeGoalSearch(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function toSearchable(option: GoalScorerOption): SearchableScorer {
  const searchName = normalizeGoalSearch(option.name)
  const parts = searchName.split(' ')
  return { ...option, searchName, lastName: parts[parts.length - 1] ?? searchName }
}

export function createScorerSearch(options: readonly GoalScorerOption[]) {
  const searchable = options.map(toSearchable)
  const fuse = new Fuse(searchable, FUSE_OPTIONS)

  return function search(query: string): readonly GoalScorerOption[] {
    const normalized = normalizeGoalSearch(query)
    if (normalized.length === 0) return options

    const exact = searchable.filter((item) => item.searchName === normalized)
    const prefix = searchable.filter(
      (item) => item.searchName !== normalized && item.searchName.startsWith(normalized),
    )
    const contains = searchable.filter(
      (item) =>
        item.searchName !== normalized &&
        !item.searchName.startsWith(normalized) &&
        item.searchName.includes(normalized),
    )

    const ranked = [...exact, ...prefix, ...contains]
    const seen = new Set(ranked.map((item) => item.id))

    for (const result of fuse.search(normalized)) {
      if (!seen.has(result.item.id)) {
        seen.add(result.item.id)
        ranked.push(result.item)
      }
    }

    return ranked
  }
}
