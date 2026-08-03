import { FormatTabs } from '@/components/navigation/FormatTabs/FormatTabs'
import { goals as allGoals } from '../../data/goals'
import { useGoalUrlState } from '../../hooks/useGoalUrlState'
import { GOAL_FORMAT_LONG_LABEL } from '../../types/goals'
import { GoalGallery } from '../GoalGallery/GoalGallery'

export function GoalsSection() {
  const { format, setFormat } = useGoalUrlState(allGoals)

  return (
    <FormatTabs
      format={format}
      onFormatChange={setFormat}
      listLabel="Modalidades de goles"
      describeFormat={(value) => `Goles de ${GOAL_FORMAT_LONG_LABEL[value]}`}
      renderPanel={(panelFormat) => (
        <>
          <h2 className="sr-only">Goles de {GOAL_FORMAT_LONG_LABEL[panelFormat]}</h2>
          <GoalGallery goals={allGoals} format={panelFormat} />
        </>
      )}
    />
  )
}
