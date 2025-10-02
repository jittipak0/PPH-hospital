import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { secureApi, type AuthenticatedUser } from '../lib/secureApi'

type AuthState = {
  user: AuthenticatedUser | null
  accessToken: string | null
  refreshToken: string | null
}

type AuthContextValue = {
  user: AuthenticatedUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  error: string | null
  login: (payload: {
    username: string
    password: string
    acceptPolicies: boolean
    rememberMe: boolean
  }) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void
}

const STORAGE_KEY = 'pph-secure-auth'
const initialState: AuthState = { user: null, accessToken: null, refreshToken: null }

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const loadInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return initialState
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return initialState
    }
    const parsed = JSON.parse(raw) as AuthState
    if (parsed.user) {
      parsed.user = {
        ...parsed.user,
        cid: parsed.user.cid ?? null,
        fullName: parsed.user.fullName ?? parsed.user.username,
        department: parsed.user.department ?? null,
        lastLoginAt: parsed.user.lastLoginAt ?? null
      }
    }
    return parsed
  } catch (error) {
    console.warn('Failed to parse auth state from sessionStorage', error)
    return initialState
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(loadInitialState)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const persistState = useCallback((next: AuthState) => {
    setState(next)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const login = useCallback(
    async (payload: { username: string; password: string; acceptPolicies: boolean; rememberMe: boolean }) => {
      try {
        clearError()
        const response = await secureApi.login(payload)
        persistState({ user: response.user, accessToken: response.accessToken, refreshToken: response.refreshToken })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'ไม่สามารถเข้าสู่ระบบได้'
        setError(message)
        throw err
      }
    },
    [clearError, persistState]
  )

  const logout = useCallback(async () => {
    try {
      await secureApi.logout(state.refreshToken, state.accessToken)
    } catch (err) {
      console.warn('Failed to call logout API', err)
    } finally {
      persistState(initialState)
    }
  }, [state.accessToken, state.refreshToken, persistState])

  const refresh = useCallback(async () => {
    if (!state.refreshToken) {
      return
    }
    try {
      const response = await secureApi.refresh(state.refreshToken)
      persistState({ user: response.user, accessToken: response.accessToken, refreshToken: response.refreshToken })
    } catch (err) {
      console.warn('Refresh token failed', err)
      persistState(initialState)
    }
  }, [state.refreshToken, persistState])

  const value = useMemo<AuthContextValue>(() => ({
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    isAuthenticated: Boolean(state.user && state.accessToken),
    error,
    login,
    logout,
    refresh,
    clearError
  }), [state.user, state.accessToken, state.refreshToken, error, login, logout, refresh, clearError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
