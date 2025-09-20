import api from '@/api/axios/instance'

import type {
  OrderCreateRequest,
  OrderResponse,
  PaginatedOrderRequest,
} from './interface'
import type { PaginatedResponse } from '@/types/common'

export const createUserOrder = async (request: OrderCreateRequest): Promise<OrderResponse> => {
  const response = await api.post<OrderResponse>('/orders/me', request)

  return response.data
}

export const getUserOrders = async (
  request: PaginatedOrderRequest,
): Promise<PaginatedResponse<OrderResponse>> => {
  const response = await api.get<PaginatedResponse<OrderResponse>>('/orders/me', request)

  return response.data
}
