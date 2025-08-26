import api from '@/api/axios/instance'

import type {
  ProductDetailRequest,
  ProductDetailResponse,
  ProductsRequest,
  ProductsResponse,
} from './interface'

export const getProducts = async (payload: ProductsRequest) => {
  const response = await api.get<ProductsResponse>('/products', payload)

  return response.data
}

export const getProductByUuid = async (
  payload: ProductDetailRequest,
): Promise<ProductDetailResponse> => {
  const response = await api.get<ProductDetailResponse>(`/products/${payload.uuid}`)

  return response.data
}
