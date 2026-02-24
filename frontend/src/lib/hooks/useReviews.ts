'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/config/axios'
import { invalidateQuery, getErrorMessage } from '@/utils/queryUtils'
import { modal } from '@/utils/modal'
import type { IReview } from '@/types'

// GET /api/reviews?productId=X  (public)
export const useProductReviews = (productId: number) =>
  useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await api.get<IReview[]>('/api/reviews', {
        params: { productId },
      })
      return data
    },
    enabled: !!productId,
  })

// POST /api/customer/reviews  (requires customer auth)
export const useCreateReview = () =>
  useMutation({
    mutationFn: (payload: { productId: number; rating: number; comment: string }) =>
      api.post<IReview>('/api/customer/reviews', payload).then((r) => r.data),
    onSuccess: (_data, variables) => {
      invalidateQuery(['reviews', variables.productId])
      modal.success('Review submitted!')
    },
    onError: (error: unknown) => {
      modal.error(getErrorMessage(error))
    },
  })
