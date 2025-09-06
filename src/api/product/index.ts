import api from '@/api/axios/instance'

import type { PaginatedRequest, PaginatedResponse } from '@/types/common'
import type { ProductDetailRequest, ProductDetailResponse } from './interface'

export const getProducts = async (request: PaginatedRequest) => {
  const response = await api.get<PaginatedResponse<ProductDetailResponse>>(
    '/public/products',
    request,
  )

  return response.data
}

export const getProductByUuid = async (
  request: ProductDetailRequest,
): Promise<ProductDetailResponse> => {
  const { uuid } = request
  const response = await api.get<ProductDetailResponse>(`/public/products/${uuid}`)

  return response.data
}
