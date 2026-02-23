import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import { setToastDispatch } from '@/utils/toast'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface IToast {
  id: number
  message: string
  type: ToastType
}

interface IToastContext {
  toasts: IToast[]
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<IToastContext | null>(null)

let toastIdCounter = 0

// Module-level helpers — keeps nesting ≤ 4 levels inside the component
const withoutId = (id: number) => (prev: IToast[]) => prev.filter(t => t.id !== id)
const withNew = (toast: IToast) => (prev: IToast[]) => [...prev, toast]

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<IToast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts(withoutId(id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastIdCounter
    setToasts(withNew({ id, message, type }))
    setTimeout(() => setToasts(withoutId(id)), 3000)
  }, [])

  useEffect(() => {
    setToastDispatch(addToast)
  }, [addToast])

  const value = useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToastContext = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be inside ToastProvider')
  return ctx
}
