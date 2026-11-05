import { useCallback, useState, type ReactNode } from 'react'
import { AuthContext, AUTH_KEY } from './context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(
    () => localStorage.getItem(AUTH_KEY) === 'true',
  )

  const login = useCallback((username: string, password: string) => {
    if (username.trim() === '' || password.trim() === '') return false
    localStorage.setItem(AUTH_KEY, 'true')
    setAuthenticated(true)
    return true
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
