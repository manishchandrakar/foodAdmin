'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/config/axios'
import { invalidateQuery, getErrorMessage } from '@/utils/queryUtils'
import { modal } from '@/utils/modal'
import type { IAuthUser } from '@/types'

const ME_KEY = ['customer', 'me']

interface IRegisterPayload {
  name: string
  email: string
  phone?: string
  password: string
}

interface ILoginPayload {
  email: string
  password: string
}

// GET /api/customer/auth/me  — restores session on mount
export const useCurrentUser = () =>
  useQuery({
    queryKey: ME_KEY,
    queryFn: async () => {
      const { data } = await api.get<IAuthUser>('/api/customer/auth/me')
      return data
    },
    retry: false,
    staleTime: Infinity,
  })

// POST /api/customer/auth/register
export const useRegister = () =>
  useMutation({
    mutationFn: (payload: IRegisterPayload) =>
      api.post<IAuthUser>('/api/customer/auth/register', payload).then((r) => r.data),
    onSuccess: () => {
      invalidateQuery(ME_KEY)
    },
    onError: (error: unknown) => {
      modal.error(getErrorMessage(error))
    },
  })

// POST /api/customer/auth/login
export const useLogin = () =>
  useMutation({
    mutationFn: (payload: ILoginPayload) =>
      api.post<IAuthUser>('/api/customer/auth/login', payload).then((r) => r.data),
    onSuccess: () => {
      invalidateQuery(ME_KEY)
    },
    onError: (error: unknown) => {
      modal.error(getErrorMessage(error))
    },
  })

// POST /api/customer/auth/logout
export const useLogout = () =>
  useMutation({
    mutationFn: () =>
      api.post('/api/customer/auth/logout').then((r) => r.data),
    onSuccess: () => {
      invalidateQuery(ME_KEY)
    },
    onError: (error: unknown) => {
      modal.error(getErrorMessage(error))
    },
  })

// PUT /api/customer/profile
export const useUpdateProfile = () =>
  useMutation({
    mutationFn: (payload: Partial<IAuthUser>) =>
      api.put<IAuthUser>('/api/customer/profile', payload).then((r) => r.data),
    onSuccess: () => {
      invalidateQuery(ME_KEY)
      modal.success('Profile updated')
    },
    onError: (error: unknown) => {
      modal.error(getErrorMessage(error))
    },
  })
