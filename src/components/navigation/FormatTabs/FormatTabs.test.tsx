import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FOOTBALL_FORMAT_LONG_LABEL, type FootballFormat } from '@/config/football-format'
import { FormatTabs } from './FormatTabs'

function renderTabs(format: FootballFormat, onFormatChange = vi.fn()) {
  render(
    <FormatTabs
      format={format}
      onFormatChange={onFormatChange}
      listLabel="Modalidades de prueba"
      describeFormat={(value) => `Contenido de ${FOOTBALL_FORMAT_LONG_LABEL[value]}`}
      renderPanel={(panelFormat) => <p>Panel {panelFormat}</p>}
    />,
  )
  return onFormatChange
}

describe('FormatTabs', () => {
  it('exposes an accessible tablist with the given format selected', () => {
    renderTabs('f8')
    expect(screen.getByRole('tablist', { name: 'Modalidades de prueba' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /F8/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /F5/ })).toHaveAttribute('aria-selected', 'false')
  })

  it('names every tab with its section-scoped hint', () => {
    renderTabs('f8')
    expect(screen.getByRole('tab', { name: /Contenido de Fútbol 8/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Contenido de Fútbol 5/ })).toBeInTheDocument()
  })

  it('calls onFormatChange when the other format is selected', async () => {
    const onFormatChange = renderTabs('f8')
    await userEvent.click(screen.getByRole('tab', { name: /F5/ }))
    expect(onFormatChange).toHaveBeenCalledWith('f5')
  })

  it('mounts only the active panel', () => {
    renderTabs('f5')
    expect(screen.getByText('Panel f5')).toBeInTheDocument()
    expect(screen.queryByText('Panel f8')).not.toBeInTheDocument()
  })
})
