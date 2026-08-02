import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { goals as allGoals } from '../../data/goals'
import { ChampionshipGoals } from './ChampionshipGoals'

/**
 * These run against the committed manifest, which is the same data the page
 * renders, so the format and championship matching is verified end to end.
 */
describe('ChampionshipGoals', () => {
  const sample = allGoals.find((goal) => goal.competition.championshipId !== undefined)

  it('renders nothing for a championship without goals', () => {
    const { container } = renderWithProviders(
      <ChampionshipGoals championshipId="f8-torneo-inexistente" format="f8" />,
      { initialEntries: ['/campeonatos'] },
    )

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText('Goles grabados')).not.toBeInTheDocument()
  })

  it('renders nothing when the format does not match the championship', () => {
    expect(sample).toBeDefined()
    const otherFormat = sample!.format === 'f8' ? 'f5' : 'f8'

    const { container } = renderWithProviders(
      <ChampionshipGoals
        championshipId={sample!.competition.championshipId!}
        format={otherFormat}
      />,
      { initialEntries: ['/campeonatos'] },
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('shows only the goals of the matching championship', () => {
    expect(sample).toBeDefined()
    const championshipId = sample!.competition.championshipId!
    const expected = allGoals.filter(
      (goal) =>
        goal.format === sample!.format && goal.competition.championshipId === championshipId,
    )

    renderWithProviders(
      <ChampionshipGoals championshipId={championshipId} format={sample!.format} />,
      { initialEntries: ['/campeonatos'] },
    )

    expect(screen.getByText('Goles grabados')).toBeInTheDocument()
    for (const card of screen.getAllByRole('button', { name: /^Abrir gol de/ })) {
      expect(card).toHaveAccessibleName(new RegExp(sample!.competition.name))
    }
    expect(screen.getAllByRole('button', { name: /^Abrir gol de/ }).length).toBeLessThanOrEqual(
      expected.length,
    )
  })
})
