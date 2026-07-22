import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from './Button'

describe('Button', () => {
  it('renders as a button with its label', () => {
    render(<Button>Ver más</Button>)
    expect(screen.getByRole('button', { name: 'Ver más' })).toBeInTheDocument()
  })

  it('is disabled and marked busy while loading', () => {
    render(<Button loading>Guardando</Button>)
    const button = screen.getByRole('button', { name: 'Guardando' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Aceptar</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Aceptar' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick while loading', async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Aceptar
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Aceptar' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
