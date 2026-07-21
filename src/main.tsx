import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@fontsource/barlow/700.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'

import './styles/globals.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element "#root" was not found in the document')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
