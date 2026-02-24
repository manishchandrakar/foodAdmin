import { toast } from '@/utils/toast'

interface ToastOptions {
	title: string
	description?: string
}

const msg = ({ title, description }: ToastOptions) =>
	description ? `${title}: ${description}` : title

export const showSuccessToast = (options: ToastOptions) => toast.success(msg(options))
export const showWarningToast = (options: ToastOptions) => toast.warning(msg(options))
export const showErrorToast   = (options: ToastOptions) => toast.error(msg(options))
export const showInfoToast    = (options: ToastOptions) => toast.info(msg(options))
