'use client'

import { createCrudHooks } from './useCrud'
import type { IProduct } from '@/types'

const productCrud = createCrudHooks<IProduct>('/api/products', 'products', {
  entityName: 'Product',
})

export const useProducts = productCrud.useGetAll
export const useProduct = productCrud.useGetById
