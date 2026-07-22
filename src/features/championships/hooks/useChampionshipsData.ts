import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { fetchChampionships } from '../api/championshipsDataSource'
import { loadChampionshipsSnapshot } from '../data/championshipsSnapshot'
import type { ChampionshipsByFormat } from '../types/championships'
import { enrichChampionshipsAssets } from '../utils/enrichChampionshipsAssets'

export type ChampionshipsDataSource = 'remote' | 'snapshot'

export type ChampionshipsDataError = {
  readonly message: string
}

export type ChampionshipsDataState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready'
      readonly data: ChampionshipsByFormat
      readonly source: ChampionshipsDataSource
      readonly syncedAt?: string
    }
  | {
      readonly status: 'refreshing'
      readonly data: ChampionshipsByFormat
      readonly source: ChampionshipsDataSource
      readonly syncedAt?: string
    }
  | {
      readonly status: 'error'
      readonly data?: ChampionshipsByFormat
      readonly source?: ChampionshipsDataSource
      readonly syncedAt?: string
      readonly error: ChampionshipsDataError
    }

export type UseChampionshipsDataResult = {
  readonly state: ChampionshipsDataState
  readonly refresh: () => void
  readonly isRefreshing: boolean
}

function count(data: ChampionshipsByFormat): number {
  return data.f8.length + data.f5.length
}

/**
 * Loads championship data with a snapshot-first, revalidate-on-load strategy.
 *
 * The committed snapshot renders immediately; the remote spreadsheet is then
 * fetched (with `cache: 'no-store'`) on every mount and replaces the data only
 * when it is valid. A failed refresh keeps the current data visible.
 */
export function useChampionshipsData(): UseChampionshipsDataResult {
  const snapshot = useMemo(() => {
    const loaded = loadChampionshipsSnapshot()
    return { syncedAt: loaded.syncedAt, data: enrichChampionshipsAssets(loaded.data) }
  }, [])

  const hasSnapshot = count(snapshot.data) > 0

  const [state, setState] = useState<ChampionshipsDataState>(() =>
    hasSnapshot
      ? {
          status: 'refreshing',
          data: snapshot.data,
          source: 'snapshot',
          ...(snapshot.syncedAt ? { syncedAt: snapshot.syncedAt } : {}),
        }
      : { status: 'loading' },
  )

  const abortRef = useRef<AbortController | null>(null)

  const startFetch = useCallback(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    fetchChampionships({ signal: controller.signal, cacheBust: Date.now() })
      .then((remote) => {
        if (controller.signal.aborted) return
        setState({ status: 'ready', data: enrichChampionshipsAssets(remote), source: 'remote' })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'No se pudo actualizar'
        setState((prev) => {
          if ('data' in prev && prev.data) {
            return {
              status: 'error',
              data: prev.data,
              source: prev.source ?? 'snapshot',
              ...(prev.syncedAt ? { syncedAt: prev.syncedAt } : {}),
              error: { message },
            }
          }
          return { status: 'error', error: { message } }
        })
      })
  }, [])

  const refresh = useCallback(() => {
    setState((prev) => {
      if ('data' in prev && prev.data) {
        return {
          status: 'refreshing',
          data: prev.data,
          source: prev.source ?? 'snapshot',
          ...(prev.syncedAt ? { syncedAt: prev.syncedAt } : {}),
        }
      }
      return { status: 'loading' }
    })
    startFetch()
  }, [startFetch])

  useEffect(() => {
    startFetch()
    return () => abortRef.current?.abort()
  }, [startFetch])

  return {
    state,
    refresh,
    isRefreshing: state.status === 'refreshing',
  }
}
