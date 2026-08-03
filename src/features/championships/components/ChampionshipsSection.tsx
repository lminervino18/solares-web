import { Trophy } from 'lucide-react'

import { CHAMPIONSHIPS_SPREADSHEET_URL } from '@/config/championships-source.config'
import type { FootballFormat } from '@/config/football-format'
import { LinkButton } from '@/components/primitives/LinkButton/LinkButton'
import { EmptyState } from '@/components/feedback/EmptyState/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState/LoadingState'
import { useChampionshipsData } from '../hooks/useChampionshipsData'
import { useChampionshipsUrlState } from '../hooks/useChampionshipsUrlState'
import type { Championship, ChampionshipsByFormat } from '../types/championships'
import { FOOTBALL_FORMAT_LABEL, FOOTBALL_FORMAT_LONG_LABEL } from '@/config/football-format'
import { FormatTabs } from '@/components/navigation/FormatTabs/FormatTabs'
import { ChampionshipCarousel } from './ChampionshipCarousel'
import { ChampionshipSpotlight } from './ChampionshipSpotlight'
import { ChampionshipsDataNotice } from './ChampionshipsDataNotice'

const EMPTY_DATA: ChampionshipsByFormat = { f8: [], f5: [] }

function selectChampionship(
  list: readonly Championship[],
  slug: string | undefined,
): Championship | undefined {
  if (list.length === 0) return undefined
  return list.find((c) => c.slug === slug) ?? list[0]
}

export function ChampionshipsSection() {
  const { state, refresh, isRefreshing } = useChampionshipsData()
  const { format, torneoSlug, setFormat, setTorneo } = useChampionshipsUrlState()

  const data = 'data' in state && state.data ? state.data : EMPTY_DATA

  if (state.status === 'loading') {
    return <LoadingState label="Cargando campeonatos" />
  }

  if (state.status === 'error' && !state.data) {
    return (
      <div>
        <ErrorState
          title="No pudimos cargar los campeonatos"
          description="Revisá tu conexión e intentá nuevamente."
          onRetry={refresh}
        />
        <div className="mt-4 flex justify-center">
          <LinkButton href={CHAMPIONSHIPS_SPREADSHEET_URL} tone="neutral" variant="text" size="sm">
            Ver planilla original
          </LinkButton>
        </div>
      </div>
    )
  }

  const renderPanel = (panelFormat: FootballFormat) => {
    const list = data[panelFormat].filter((championship) => championship.published)

    if (list.length === 0) {
      return (
        <EmptyState
          icon={Trophy}
          title={`Todavía no hay campeonatos de ${FOOTBALL_FORMAT_LABEL[panelFormat]} disponibles.`}
          description="Cuando se agreguen a la planilla, aparecerán acá automáticamente."
        />
      )
    }

    const activeSlug = panelFormat === format ? torneoSlug : undefined
    const selected = selectChampionship(list, activeSlug)
    if (!selected) return null
    const position = list.indexOf(selected) + 1

    return (
      <div className="flex flex-col gap-10">
        <ChampionshipCarousel
          format={panelFormat}
          championships={list}
          selectedChampionshipId={selected.id}
          onSelectionChange={(id) => {
            const championship = list.find((c) => c.id === id)
            if (championship) setTorneo(championship.slug)
          }}
        />
        <ChampionshipSpotlight championship={selected} position={position} total={list.length} />
      </div>
    )
  }

  return (
    <div>
      <FormatTabs
        format={format}
        onFormatChange={setFormat}
        renderPanel={renderPanel}
        listLabel="Modalidades de campeonatos"
        describeFormat={(value) => `Campeonatos de ${FOOTBALL_FORMAT_LONG_LABEL[value]}`}
      />
      <ChampionshipsDataNotice state={state} isRefreshing={isRefreshing} onRefresh={refresh} />
    </div>
  )
}
