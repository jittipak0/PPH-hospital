import React, { createContext, useContext, useMemo, useState } from 'react'

type User = {
  name: string
  role: 'guest' | 'patient' | 'staff'
}

type AuthContextValue = {
  user: User
  loginAs: (name: string, role: User['role']) => void
  logout: () => void
}

const defaultUser: User = { name: 'ผู้เยี่ยมชม', role: 'guest' }

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser)

  const loginAs = (name: string, role: User['role']) => {
    setUser({ name, role })
  }

  const logout = () => {
    setUser(defaultUser)
  }

  const value = useMemo<AuthContextValue>(() => ({ user, loginAs, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
