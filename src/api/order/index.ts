import api from '@/api/axios/instance'

import type { PaginatedRequest, PaginatedResponse } from '@/api/common/interface'
import type { OrderCreateRequest, OrderResponse } from './interface'

/*
 * POST method
 */

export const createUserOrder = async (request: OrderCreateRequest): Promise<OrderResponse> => {
  const response = await api.post<OrderResponse>('/orders/me', request)

  return response.data
}

/*
 * GET method
 */

export const getUserOrders = async (
  request: PaginatedRequest,
): Promise<PaginatedResponse<OrderResponse>> => {
  const response = await api.get<PaginatedResponse<OrderResponse>>('/orders/me', request)

  return response.data
}

export const getUserOrderByUuid = async (orderUuid: string): Promise<OrderResponse> => {
  const response = await api.get<OrderResponse>(`/orders/me/${orderUuid}`)

  return response.data
}

/*
 * PUT method
 */

export const cancelUserOrderByUuid = async (orderUuid: string): Promise<OrderResponse> => {
  const response = await api.put<OrderResponse>(`/orders/me/${orderUuid}`)

  return response.data
}
