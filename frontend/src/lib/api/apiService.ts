import { api } from '@/lib/config/axios'

export const apiService = <T>(endpoint: string) => ({
  getAll: async (params?: Record<string, string | number>): Promise<T[]> => {
    const { data } = await api.get<T[]>(endpoint, { params })
    return data
  },

  getById: async (id: string | number): Promise<T> => {
    const { data } = await api.get<T>(`${endpoint}/${id}`)
    return data
  },

  create: async (payload: Record<string, unknown>): Promise<T> => {
    const { data } = await api.post<T>(endpoint, payload)
    return data
  },

  update: async (id: string | number, payload: Record<string, unknown>): Promise<T> => {
    const { data } = await api.put<T>(`${endpoint}/${id}`, payload)
    return data
  },

  delete: async (id: string | number): Promise<{ success: boolean }> => {
    const { data } = await api.delete<{ success: boolean }>(`${endpoint}/${id}`)
    return data
  },
})
