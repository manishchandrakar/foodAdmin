import { queryClient } from '@/lib/config/queryClient'
import axios from 'axios'

export const invalidateQuery = (keys: unknown[]) => {
  queryClient.invalidateQueries({ queryKey: keys })
}

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || 'Something went wrong'
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}
