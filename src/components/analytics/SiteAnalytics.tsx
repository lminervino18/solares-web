import { Analytics } from '@vercel/analytics/react'

import { siteConfig } from '@/config/site.config'

function isProductionHost(): boolean {
  if (typeof window === 'undefined' || siteConfig.siteUrl === '') return false
  const expected = new URL(siteConfig.siteUrl).host.replace(/^www\./, '')
  return window.location.host.replace(/^www\./, '') === expected
}

// Mounted only on the production host. Anywhere else the beacon it injects has
// no endpoint to answer it, and the resulting 404 shows up as a console error in
// local previews and end-to-end runs.
export function SiteAnalytics() {
  return isProductionHost() ? <Analytics /> : null
}
