import { createPalurnApi } from '@palurn/api'

export const api = createPalurnApi({
  mode: import.meta.env.VITE_API_MODE === 'real' ? 'real' : 'mock',
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10_000,
})
