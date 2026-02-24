'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/config/axios'
import { getErrorMessage } from '@/utils/queryUtils'
import { modal } from '@/utils/modal'

interface ICouponValidateResponse {
  valid: boolean
  code: string
  discountPercent: number
}

// POST /api/customer/coupons/validate  (public)
export const useValidateCoupon = () =>
  useMutation({
    mutationFn: (code: string) =>
      api.post<ICouponValidateResponse>('/api/customer/coupons/validate', { code })
        .then((r) => r.data),
    onError: (error: unknown) => {
      modal.error(getErrorMessage(error))
    },
  })
