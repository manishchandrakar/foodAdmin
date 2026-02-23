import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { IAuthUser } from '@/types'

interface IAuthContext {
  user: IAuthUser | null
  isLoggedIn: boolean
  login: (user: IAuthUser) => void
  logout: () => void
}

const AuthContext = createContext<IAuthContext | null>(null)

// Demo logged-in user
const DEMO_USER: IAuthUser = {
  id: 1,
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '9876543210',
  role: 'customer',
}

interface IAuthProvider{
  children:ReactNode
}
export const AuthProvider = (props: IAuthProvider) => {
  const { children } = props
  const [user, setUser] = useState<IAuthUser | null>(DEMO_USER)

  const login = (userData: IAuthUser) => setUser(userData)
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
