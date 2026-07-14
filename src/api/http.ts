import axios from 'axios'
import { clearAuthSession, getAuthorizationHeader } from '@/utils/authStorage'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const authorization = getAuthorizationHeader()
  if (authorization) config.headers.Authorization = authorization
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthSession()
      if (window.location.pathname !== '/login') {
        const redirect = `${window.location.pathname}${window.location.search}`
        window.location.replace(`/login?redirect=${encodeURIComponent(redirect)}`)
      }
    }
    return Promise.reject(error)
  },
)
