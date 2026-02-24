import type { ToastType } from '@/context/ToastContext'

// Global dispatch reference — set karo ToastProvider mount hone ke baad
type ToastFn = (message: string, type: ToastType) => void
let _dispatch: ToastFn | null = null

export const setToastDispatch = (fn: ToastFn) => {
  _dispatch = fn
}

const fire = (message: string, type: ToastType) => {
  _dispatch?.(message, type)
}

export const toast = {
  success: (message: string) => fire(message, 'success'),
  error:   (message: string) => fire(message, 'error'),
  info:    (message: string) => fire(message, 'info'),
  warning: (message: string) => fire(message, 'warning'),
}
