'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { apiService } from '@/lib/api/apiService'
import { invalidateQuery, getErrorMessage } from '@/utils/queryUtils'
import { modal } from '@/utils/modal'

interface IUseCrudOptions {
  entityName: string
}

export const createCrudHooks = <T>(
  endpoint: string,
  queryKey: string,
  options: IUseCrudOptions
) => {
  const service = apiService<T>(endpoint)
  const { entityName } = options
  const allKey = [queryKey]
  const detailKey = (id: string | number) => [queryKey, String(id)]

  const useGetAll = (params?: Record<string, string | number>) =>
    useQuery({
      queryKey: params ? [...allKey, params] : allKey,
      queryFn: () => service.getAll(params),
    })

  const useGetById = (id: string | number) =>
    useQuery({
      queryKey: detailKey(id),
      queryFn: () => service.getById(id),
      enabled: !!id,
    })

  const useCreate = () =>
    useMutation({
      mutationFn: (payload: Record<string, unknown>) => service.create(payload),
      onSuccess: () => {
        invalidateQuery(allKey)
        modal.success(`${entityName} created successfully`)
      },
      onError: (error: unknown) => {
        modal.error(getErrorMessage(error))
      },
    })

  const useUpdate = () =>
    useMutation({
      mutationFn: ({ id, payload }: { id: string | number; payload: Record<string, unknown> }) =>
        service.update(id, payload),
      onSuccess: (_data, variables) => {
        invalidateQuery(allKey)
        invalidateQuery(detailKey(variables.id))
        modal.success(`${entityName} updated successfully`)
      },
      onError: (error: unknown) => {
        modal.error(getErrorMessage(error))
      },
    })

  const useDelete = () =>
    useMutation({
      mutationFn: (id: string | number) => service.delete(id),
      onSuccess: () => {
        invalidateQuery(allKey)
        modal.success(`${entityName} deleted`)
      },
      onError: (error: unknown) => {
        modal.error(getErrorMessage(error))
      },
    })

  return { useGetAll, useGetById, useCreate, useUpdate, useDelete }
}
