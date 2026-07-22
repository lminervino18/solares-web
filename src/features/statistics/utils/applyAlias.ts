/**
 * Resolves a raw name to its canonical form using an explicit alias map.
 *
 * The map is keyed by a normalized (trimmed, lowercased, unaccented) name and
 * returns the canonical display name. Names not in the map are returned trimmed
 * but otherwise unchanged. There is no fuzzy matching: entities are only merged
 * through confirmed, explicit aliases.
 */
export function applyAlias(name: string, aliases: Readonly<Record<string, string>>): string {
  const trimmed = name.trim()
  const key = trimmed.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ')
  return aliases[key] ?? trimmed
}
