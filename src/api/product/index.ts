import api from '@/api/axios/instance'

import type { PaginatedRequest, PaginatedResponse } from '@/types/common/interface'
import type { ProductDetailResponse } from './interface'

export const getProducts = async (request: PaginatedRequest) => {
  const response = await api.get<PaginatedResponse<ProductDetailResponse>>(
    '/public/products',
    request,
  )

  return response.data
}

export const getProductByUuid = async (request: string): Promise<ProductDetailResponse> => {
  const response = await api.get<ProductDetailResponse>(`/public/products/${request}`)

  return response.data
}
