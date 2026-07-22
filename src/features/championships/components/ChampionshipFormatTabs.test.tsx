import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { FootballFormat } from '@/config/championships-source.config'
import { ChampionshipFormatTabs } from './ChampionshipFormatTabs'

function renderTabs(format: FootballFormat, onFormatChange = vi.fn()) {
  render(
    <ChampionshipFormatTabs
      format={format}
      onFormatChange={onFormatChange}
      renderPanel={(panelFormat) => <p>Panel {panelFormat}</p>}
    />,
  )
  return onFormatChange
}

describe('ChampionshipFormatTabs', () => {
  it('exposes an accessible tablist with F8 selected by default', () => {
    renderTabs('f8')
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /F8/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /F5/ })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onFormatChange when F5 is selected', async () => {
    const onFormatChange = renderTabs('f8')
    await userEvent.click(screen.getByRole('tab', { name: /F5/ }))
    expect(onFormatChange).toHaveBeenCalledWith('f5')
  })

  it('shows only the active panel', () => {
    renderTabs('f5')
    expect(screen.getByText('Panel f5')).toBeInTheDocument()
    expect(screen.queryByText('Panel f8')).not.toBeInTheDocument()
  })
})
