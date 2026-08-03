import { championshipsSnapshotSchema } from '../schemas/championship.schema'
import type { Championship, ChampionshipsByFormat } from '../types/championships'
import snapshotJson from './generated/championships.snapshot.json'

export type LoadedSnapshot = {
  readonly syncedAt?: string
  readonly data: ChampionshipsByFormat
}

const EMPTY: ChampionshipsByFormat = { f8: [], f5: [] }

function groupByFormat(championships: readonly Championship[]): ChampionshipsByFormat {
  return {
    f8: championships.filter((c) => c.format === 'f8'),
    f5: championships.filter((c) => c.format === 'f5'),
  }
}

export function loadChampionshipsSnapshot(): LoadedSnapshot {
  const parsed = championshipsSnapshotSchema.safeParse(snapshotJson)
  if (!parsed.success) {
    return { data: EMPTY }
  }
  return {
    syncedAt: parsed.data.syncedAt,
    data: groupByFormat(parsed.data.championships as readonly Championship[]),
  }
}
