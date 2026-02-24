'use client'

import { createContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import { setModalDispatch } from '@/utils/modal'
import type { ModalType } from '@/utils/modal'
import SuccessModal from '@/components/modals/SuccessModal'
import WarningModal from '@/components/modals/WarningModal'

interface IModalState {
  isOpen: boolean
  message: string
  type: ModalType | null
}

// Context is internal — no external consumers needed
createContext<null>(null)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<IModalState>({ isOpen: false, message: '', type: null })

  const show = useCallback((message: string, type: ModalType) => {
    setState({ isOpen: true, message, type })
  }, [])

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  useEffect(() => {
    setModalDispatch(show)
  }, [show])

  // Auto-close after 2.5 s (like a toast)
  useEffect(() => {
    if (!state.isOpen) return
    const t = setTimeout(close, 2500)
    return () => clearTimeout(t)
  }, [state.isOpen, close])

  const isSuccess = state.type === 'success' || state.type === 'info'
  const isWarning = state.type === 'warning' || state.type === 'error'

  return (
    <>
      {children}
      {isSuccess && (
        <SuccessModal isOpen={state.isOpen} onClose={close} message={state.message} />
      )}
      {isWarning && (
        <WarningModal isOpen={state.isOpen} onClose={close} message={state.message} />
      )}
    </>
  )
}
