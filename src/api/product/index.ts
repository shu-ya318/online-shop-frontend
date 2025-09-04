import api from '@/api/axios/instance'

import type { PaginatedResponse } from '@/types/common'
import type { ProductsRequest } from './interface'
import type { ProductDetailRequest, ProductDetailResponse } from './interface'

export const getProducts = async (payload: ProductsRequest) => {
  const response = await api.get<PaginatedResponse<ProductDetailResponse>>(
    '/public/products',
    payload,
  )

  return response.data
}

export const getProductByUuid = async (
  payload: ProductDetailRequest,
): Promise<ProductDetailResponse> => {
  const { uuid } = payload
  const response = await api.get<ProductDetailResponse>(`/public/products/${uuid}`)

  return response.data
}
