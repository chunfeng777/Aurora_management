import { isAxiosError } from 'axios'

interface ErrorResponse {
  message?: string
  msg?: string
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.msg || error.response?.data?.message || error.message || fallback
  }
  return error instanceof Error ? error.message : fallback
}
