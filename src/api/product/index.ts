import api from '@/api/axios/instance'
import type { ProductsRequest, ProductsResponse } from './interface'

export const getProducts = async (request: ProductsRequest) => {
  const response = await api.get<ProductsResponse>('/products', { params: request })

  return response.data
}
