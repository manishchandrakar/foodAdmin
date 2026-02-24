import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi'
import { useToastContext } from '@/context/ToastContext'
import type { ToastType } from '@/context/ToastContext'

const config: Record<ToastType, { icon: React.ReactNode; bar: string; bg: string; text: string }> = {
  success: {
    icon: <FiCheckCircle size={18} />,
    bar: 'bg-themeColor',
    bg: 'bg-white border-l-4 border-themeColor',
    text: 'text-themeColor',
  },
  error: {
    icon: <FiXCircle size={18} />,
    bar: 'bg-red-500',
    bg: 'bg-white border-l-4 border-red-500',
    text: 'text-red-500',
  },
  info: {
    icon: <FiInfo size={18} />,
    bar: 'bg-blue-500',
    bg: 'bg-white border-l-4 border-blue-500',
    text: 'text-blue-500',
  },
  warning: {
    icon: <FiAlertTriangle size={18} />,
    bar: 'bg-yellow-500',
    bg: 'bg-white border-l-4 border-yellow-500',
    text: 'text-yellow-600',
  },
}

const CustomToastContainer = () => {
  const { toasts, removeToast } = useToastContext()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 min-w-[280px] max-w-sm">
      {toasts.map(toast => {
        const { icon, bg, text } = config[toast.type]
        return (
          <div
            key={toast.id}
            className={`${bg} rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 animate-in slide-in-from-right-4 duration-300`}
          >
            <span className={`${text} mt-0.5 shrink-0`}>{icon}</span>
            <p className="text-sm text-gray-700 flex-1 leading-snug">{toast.message}</p>
            <button
              className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
              onClick={() => removeToast(toast.id)}
            >
              <FiX size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default CustomToastContainer
