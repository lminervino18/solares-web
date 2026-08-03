import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

import { fetchChampionships } from '@/features/championships/api/championshipsDataSource'
import { championshipsSnapshotSchema } from '@/features/championships/schemas/championship.schema'
import type { ChampionshipsSnapshot } from '@/features/championships/types/championships'

const SNAPSHOT_PATH = 'src/features/championships/data/generated/championships.snapshot.json'

async function buildSnapshot(): Promise<ChampionshipsSnapshot> {
  const model = await fetchChampionships({ cacheBust: Date.now() })
  const championships = [...model.f8, ...model.f5]
  return { syncedAt: new Date().toISOString(), championships }
}

function serialize(snapshot: ChampionshipsSnapshot): string {
  return `${JSON.stringify(snapshot, null, 2)}\n`
}

function withoutTimestamp(json: string): string {
  return json.replace(/"syncedAt":\s*"[^"]*"/, '"syncedAt":""')
}

async function main(): Promise<void> {
  const check = process.argv.includes('--check')

  let snapshot: ChampionshipsSnapshot
  try {
    snapshot = await buildSnapshot()
  } catch (error) {
    console.error('Failed to fetch championship data:', error)
    process.exit(1)
    return
  }

  const parsed = championshipsSnapshotSchema.safeParse(snapshot)
  if (!parsed.success) {
    console.error('Built snapshot failed validation. Keeping the existing snapshot.')
    console.error(parsed.error.issues.slice(0, 5))
    process.exit(1)
    return
  }

  if (snapshot.championships.length === 0) {
    console.error('Built snapshot has no championships. Refusing to overwrite.')
    process.exit(1)
    return
  }

  const output = serialize(snapshot)

  if (check) {
    if (!existsSync(SNAPSHOT_PATH)) {
      console.error('No snapshot found. Run "npm run sync:championships".')
      process.exit(1)
      return
    }
    const current = readFileSync(SNAPSHOT_PATH, 'utf-8')
    if (withoutTimestamp(current) === withoutTimestamp(output)) {
      console.log('Snapshot is up to date.')
      return
    }
    console.error('Snapshot is stale. Run "npm run sync:championships".')
    process.exit(1)
    return
  }

  await mkdir(dirname(SNAPSHOT_PATH), { recursive: true })
  writeFileSync(SNAPSHOT_PATH, output)
  const counts = snapshot.championships.reduce(
    (acc, c) => ({ ...acc, [c.format]: (acc[c.format] ?? 0) + 1 }),
    {} as Record<string, number>,
  )
  console.log(`Wrote ${SNAPSHOT_PATH}`)
  console.log(`Championships: F8=${counts.f8 ?? 0}, F5=${counts.f5 ?? 0}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
