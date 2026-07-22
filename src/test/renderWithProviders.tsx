import { type ReactElement, type ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'motion/react'
import { MemoryRouter } from 'react-router-dom'

type ProvidersOptions = {
  initialEntries?: string[]
}

function Providers({
  children,
  initialEntries,
}: {
  children: ReactNode
  initialEntries: string[]
}) {
  return (
    <HelmetProvider>
      <MotionConfig reducedMotion="always">
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </MotionConfig>
    </HelmetProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries, ...options }: ProvidersOptions & Omit<RenderOptions, 'wrapper'> = {},
) {
  const entries = initialEntries ?? ['/']
  return render(ui, {
    wrapper: ({ children }) => <Providers initialEntries={entries}>{children}</Providers>,
    ...options,
  })
}
