import { type ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'motion/react'

export type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <HelmetProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </HelmetProvider>
  )
}
