import api from '@/api/axios/instance'

import type { FilteredPaginatedRequest, PaginatedResponse } from '@/api/common/interface'
import type { ProductResponse } from './interface'

/*
 GET method
 */

export const getProducts = async (request: FilteredPaginatedRequest) => {
  const response = await api.get<PaginatedResponse<ProductResponse>>(
    '/public/products',
    request,
  )

  return response.data
}

export const getProductByUuid = async (productUuid: string): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>(`/public/products/${productUuid}`)

  return response.data
}
