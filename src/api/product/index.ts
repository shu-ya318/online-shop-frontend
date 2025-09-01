import api from '@/api/axios/instance'

import type {
  ProductDetailRequest,
  ProductDetailResponse,
  ProductsRequest,
  ProductsResponse,
} from './interface'

export const getProducts = async (payload: ProductsRequest) => {
  const response = await api.get<ProductsResponse>('/public/products', payload)

  return response.data
}

export const getProductByUuid = async (
  payload: ProductDetailRequest,
): Promise<ProductDetailResponse> => {
  const { uuid } = payload
  const response = await api.get<ProductDetailResponse>(`/public/products/${uuid}`)

  return response.data
}
