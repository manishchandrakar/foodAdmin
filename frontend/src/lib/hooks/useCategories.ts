'use client'

import { createCrudHooks } from './useCrud'
import type { ICategory } from '@/types'

const categoryCrud = createCrudHooks<ICategory>('/api/categories', 'categories', {
  entityName: 'Category',
})

export const useCategories = categoryCrud.useGetAll
export const useCategory = categoryCrud.useGetById
