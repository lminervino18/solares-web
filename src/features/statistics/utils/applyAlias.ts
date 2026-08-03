export function applyAlias(name: string, aliases: Readonly<Record<string, string>>): string {
  const trimmed = name.trim()
  const key = trimmed.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ')
  return aliases[key] ?? trimmed
}
