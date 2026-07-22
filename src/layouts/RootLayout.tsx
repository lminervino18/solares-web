import { Suspense, useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'

import { AppHeader } from '@/components/layout/AppHeader/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter/AppFooter'
import { LoadingState } from '@/components/feedback/LoadingState/LoadingState'

export function RootLayout() {
  const mainRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    mainRef.current?.focus()
  }, [location.pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>

      <AppHeader />

      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<LoadingState />}>
          <Outlet />
        </Suspense>
      </main>

      <AppFooter />
      <ScrollRestoration />
    </div>
  )
}
