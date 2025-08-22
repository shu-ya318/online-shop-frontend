import api from '@/api/axios/instance'

import type { ProductsRequest, ProductsResponse } from './interface'

export const getProducts = async (payload: ProductsRequest) => {
  const response = await api.get<ProductsResponse>('/products', { params: payload })

  return response.data
}
