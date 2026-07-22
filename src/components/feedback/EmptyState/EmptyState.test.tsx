import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders the title as a heading and the description', () => {
    render(
      <EmptyState
        title="Sección preparada"
        description="El contenido de esta sección se incorporará en una próxima etapa."
      />,
    )

    expect(screen.getByRole('heading', { name: 'Sección preparada' })).toBeInTheDocument()
    expect(
      screen.getByText('El contenido de esta sección se incorporará en una próxima etapa.'),
    ).toBeInTheDocument()
  })
})
