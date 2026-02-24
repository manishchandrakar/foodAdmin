'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/config/axios'
import { invalidateQuery, getErrorMessage } from '@/utils/queryUtils'
import { modal } from '@/utils/modal'
import type { IOrder } from '@/types'

const ORDERS_KEY = ['customer', 'orders']

// GET /api/customer/orders
export const useMyOrders = () =>
  useQuery({
    queryKey: ORDERS_KEY,
    queryFn: async () => {
      const { data } = await api.get<IOrder[]>('/api/customer/orders')
      return data
    },
  })

// GET /api/customer/orders/:id
export const useMyOrder = (id: number) =>
  useQuery({
    queryKey: [...ORDERS_KEY, id],
    queryFn: async () => {
      const { data } = await api.get<IOrder>(`/api/customer/orders/${id}`)
      return data
    },
    enabled: !!id,
  })

interface IPlaceOrderPayload {
  totalAmount: number
  paymentMethod: 'cash' | 'card' | 'upi' | 'netbanking' | 'wallet'
  address: string
  couponCode?: string
  items: { productId: number; quantity: number; price: number }[]
}

// POST /api/customer/orders
export const usePlaceOrder = () =>
  useMutation({
    mutationFn: (payload: IPlaceOrderPayload) =>
      api.post<IOrder>('/api/customer/orders', payload).then((r) => r.data),
    onSuccess: () => {
      invalidateQuery(ORDERS_KEY)
    },
    onError: (error: unknown) => {
      modal.error(getErrorMessage(error))
    },
  })

// POST /api/customer/orders/:id/cancel
export const useCancelOrder = () =>
  useMutation({
    mutationFn: (id: number) =>
      api.post<IOrder>(`/api/customer/orders/${id}/cancel`).then((r) => r.data),
    onSuccess: () => {
      invalidateQuery(ORDERS_KEY)
      modal.success('Order cancelled')
    },
    onError: (error: unknown) => {
      modal.error(getErrorMessage(error))
    },
  })
