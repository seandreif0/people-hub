import { createContext, useContext } from 'react'

export const AUTH_KEY = 'cigna-demo-authenticated'

export interface AuthState {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
