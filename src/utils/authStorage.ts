import type { AuthenticationToken } from '@/types/auth'

const AUTH_SESSION_KEY = 'aurora-management-auth'

export interface AuthSession {
  username: string
  tokenType: string
  accessToken: string
  refreshToken: string
  expiresAt: number | null
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) return false
  const session = value as Record<string, unknown>
  return typeof session.username === 'string'
    && typeof session.tokenType === 'string'
    && typeof session.accessToken === 'string'
    && typeof session.refreshToken === 'string'
    && (typeof session.expiresAt === 'number' || session.expiresAt === null)
}

export function saveAuthSession(username: string, token: AuthenticationToken): void {
  const session: AuthSession = {
    username,
    tokenType: token.tokenType || 'Bearer',
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAt: token.expiresIn > 0 ? Date.now() + token.expiresIn * 1000 : null,
  }
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
}

export function getAuthSession(): AuthSession | null {
  const value = localStorage.getItem(AUTH_SESSION_KEY)
  if (!value) return null

  try {
    const session: unknown = JSON.parse(value)
    if (!isAuthSession(session)) {
      clearAuthSession()
      return null
    }
    if (session.expiresAt !== null && session.expiresAt <= Date.now()) {
      clearAuthSession()
      return null
    }
    return session
  } catch {
    clearAuthSession()
    return null
  }
}

export function getAuthorizationHeader(): string | null {
  const session = getAuthSession()
  return session ? `${session.tokenType} ${session.accessToken}` : null
}

export function isAuthenticated(): boolean {
  return getAuthSession() !== null
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_SESSION_KEY)
}
