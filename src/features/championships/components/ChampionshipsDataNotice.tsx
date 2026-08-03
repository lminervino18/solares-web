import { AlertTriangle, ExternalLink, RotateCw } from 'lucide-react'

import { CHAMPIONSHIPS_SPREADSHEET_URL } from '@/config/championships-source.config'
import { Button } from '@/components/primitives/Button/Button'
import { LinkButton } from '@/components/primitives/LinkButton/LinkButton'
import type { ChampionshipsDataState } from '../hooks/useChampionshipsData'

export type ChampionshipsDataNoticeProps = {
  state: ChampionshipsDataState
  isRefreshing: boolean
  onRefresh: () => void
}

function statusMessage(state: ChampionshipsDataState): string {
  if (state.status === 'error') return 'Mostrando la última versión disponible.'
  if (state.status === 'ready' && state.source === 'snapshot') {
    return 'Mostrando la última versión disponible.'
  }
  return 'Datos actualizados desde la planilla de Solares.'
}

export function ChampionshipsDataNotice({
  state,
  isRefreshing,
  onRefresh,
}: ChampionshipsDataNoticeProps) {
  const isError = state.status === 'error'

  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-5 text-[length:var(--font-size-sm)] text-muted">
      <span className="inline-flex items-center gap-1.5">
        {isError && <AlertTriangle className="size-4 text-warning" aria-hidden="true" />}
        {statusMessage(state)}
      </span>

      <LinkButton
        href={CHAMPIONSHIPS_SPREADSHEET_URL}
        tone="neutral"
        variant="text"
        size="sm"
        trailingIcon={<ExternalLink className="size-4" aria-hidden="true" />}
      >
        Ver planilla original
      </LinkButton>

      <Button
        type="button"
        tone="neutral"
        variant="text"
        size="sm"
        loading={isRefreshing}
        onClick={onRefresh}
        leadingIcon={<RotateCw className="size-4" aria-hidden="true" />}
      >
        {isRefreshing ? 'Actualizando…' : 'Actualizar datos'}
      </Button>
    </div>
  )
}
