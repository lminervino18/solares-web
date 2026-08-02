import { CHAMPIONSHIPS_SPREADSHEET_URL } from '@/config/championships-source.config'
import { FOOTBALL_FORMAT_LONG_LABEL } from '@/config/football-format'
import { FormatTabs } from '@/components/navigation/FormatTabs/FormatTabs'
import { LinkButton } from '@/components/primitives/LinkButton/LinkButton'
import { ErrorState } from '@/components/feedback/ErrorState/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState/LoadingState'
import { useChampionshipsData } from '@/features/championships/hooks/useChampionshipsData'
import { ChampionshipsDataNotice } from '@/features/championships/components/ChampionshipsDataNotice'
import type { ChampionshipsByFormat } from '@/features/championships/types/championships'
import { useStatisticsScope } from '../hooks/useStatisticsScope'
import { StatisticsPanel } from './StatisticsPanel'

const EMPTY_DATA: ChampionshipsByFormat = { f8: [], f5: [] }

/**
 * Orchestrates the Statistics experience: the F8/F5 scope tabs and the
 * per-format statistics panel, over the shared snapshot-first data hook. The
 * two formats are never combined.
 */
export function StatisticsSection() {
  const { state, refresh, isRefreshing } = useChampionshipsData()
  const { scope, setScope } = useStatisticsScope()

  const data = 'data' in state && state.data ? state.data : EMPTY_DATA

  if (state.status === 'loading') {
    return <LoadingState label="Cargando estadísticas" />
  }

  if (state.status === 'error' && !state.data) {
    return (
      <div>
        <ErrorState
          title="No pudimos cargar las estadísticas"
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

  return (
    <div>
      <FormatTabs
        format={scope}
        onFormatChange={setScope}
        renderPanel={(panelScope) => <StatisticsPanel data={data} scope={panelScope} />}
        listLabel="Modalidad de las estadísticas"
        describeFormat={(value) => `Estadísticas de ${FOOTBALL_FORMAT_LONG_LABEL[value]}`}
      />
      <ChampionshipsDataNotice state={state} isRefreshing={isRefreshing} onRefresh={refresh} />
    </div>
  )
}
