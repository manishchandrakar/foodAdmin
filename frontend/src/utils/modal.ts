export type ModalType = 'success' | 'warning' | 'error' | 'info'

type ModalFn = (message: string, type: ModalType) => void
let _dispatch: ModalFn | null = null

export const setModalDispatch = (fn: ModalFn) => {
  _dispatch = fn
}

export const modal = {
  success: (message: string) => _dispatch?.(message, 'success'),
  error:   (message: string) => _dispatch?.(message, 'error'),
  info:    (message: string) => _dispatch?.(message, 'info'),
  warning: (message: string) => _dispatch?.(message, 'warning'),
}
