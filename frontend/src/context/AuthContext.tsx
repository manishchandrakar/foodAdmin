'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { IAuthUser } from '@/types'
import { api } from '@/lib/config/axios'

interface IAuthContext {
  user: IAuthUser | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (user: IAuthUser) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<IAuthContext | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IAuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from cookie on mount
  const refreshUser = async () => {
    try {
      const { data } = await api.get<IAuthUser>('/api/customer/auth/me')
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = (userData: IAuthUser) => setUser(userData)

  const logout = () => {
    api.post('/api/customer/auth/logout').catch(() => null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
