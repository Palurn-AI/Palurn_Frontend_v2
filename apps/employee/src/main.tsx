import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@palurn/api'
import '@palurn/ui/globals.css'
import App from './App.tsx'
import { api } from './api.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders api={api}>
      <App />
    </AppProviders>
  </StrictMode>,
)
