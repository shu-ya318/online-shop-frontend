import api from '@/api/axios/instance'

import type { CartResponse, AddCartItemRequest, UpdateCartItemQuantityRequest } from './interface'

export const addCartItem = async (request: AddCartItemRequest): Promise<CartResponse> => {
  const response = await api.post<CartResponse>('/users/me/cart/items', request)

  return response.data
}

export const getUserCart = async (): Promise<CartResponse> => {
  const response = await api.get<CartResponse>('/users/me/cart')

  return response.data
}

export const updateCartItemQuantity = async (
  request: UpdateCartItemQuantityRequest,
): Promise<CartResponse> => {
  const response = await api.put<CartResponse>(`/users/me/cart/items/${request.productUuid}`, {
    quantity: request.quantity,
  })

  return response.data
}

export const removeCartItem = async (request: string): Promise<CartResponse> => {
  const response = await api.delete<CartResponse>(`/users/me/cart/items/${request}`)

  return response.data
}
