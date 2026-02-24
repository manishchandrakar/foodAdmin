'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { HeroUIProvider } from '@heroui/react'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { ModalProvider } from '@/context/ModalContext'
import MainLayout from '@/components/layout/MainLayout'
import { queryClient } from '@/lib/config/queryClient'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <ModalProvider>
          <AuthProvider>
            <CartProvider>
              <MainLayout>{children}</MainLayout>
            </CartProvider>
          </AuthProvider>
        </ModalProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  )
}
