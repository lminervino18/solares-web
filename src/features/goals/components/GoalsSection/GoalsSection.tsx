import { goals as allGoals } from '../../data/goals'
import { useGoalUrlState } from '../../hooks/useGoalUrlState'
import { GOAL_FORMAT_LONG_LABEL } from '../../types/goals'
import { GoalFormatTabs } from '../GoalFormatTabs/GoalFormatTabs'
import { GoalGallery } from '../GoalGallery/GoalGallery'

/**
 * The Goles page content: the F8/F5 switch and the gallery for the active
 * format. F8 is the default and the two collections are never mixed.
 */
export function GoalsSection() {
  const { format, setFormat } = useGoalUrlState(allGoals)

  return (
    <GoalFormatTabs
      format={format}
      onFormatChange={setFormat}
      renderPanel={(panelFormat) => (
        <>
          <h2 className="sr-only">Goles de {GOAL_FORMAT_LONG_LABEL[panelFormat]}</h2>
          <GoalGallery goals={allGoals} format={panelFormat} />
        </>
      )}
    />
  )
}
