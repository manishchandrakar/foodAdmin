import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from '@/context/ToastContext'
import CustomToastContainer from '@/components/custom/CustomToastContainer'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider>
        <App />
        <CustomToastContainer />
      </ToastProvider>
    </HeroUIProvider>
  </StrictMode>,
)
