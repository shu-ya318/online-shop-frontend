import api from '@/api/axios/instance'

import type { CartResponse, CartAddItemRequest, CartItemQuantityUpdateRequest } from './interface'

export const addCartItem = async (request: CartAddItemRequest): Promise<CartResponse> => {
  const response = await api.post<CartResponse>('/carts/me/items', request)

  return response.data
}

export const getUserCart = async (): Promise<CartResponse> => {
  const response = await api.get<CartResponse>('/carts/me')

  return response.data
}

export const updateCartItemQuantity = async (
  request: CartItemQuantityUpdateRequest,
): Promise<CartResponse> => {
  const response = await api.put<CartResponse>(`/carts/me/items/${request.productUuid}`, {
    quantity: request.quantity,
  })

  return response.data
}

export const removeCartItem = async (request: string): Promise<CartResponse> => {
  const response = await api.delete<CartResponse>(`/carts/me/items/${request}`)

  return response.data
}
