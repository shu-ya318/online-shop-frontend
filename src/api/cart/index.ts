import api from '@/api/axios/instance'

import type { CartResponse, CartItemAddRequest } from './interface'

/*
 * POST method
 */

export const addUserCartItem = async (request: CartItemAddRequest): Promise<CartResponse> => {
  const response = await api.post<CartResponse>('/carts/me/items', request)

  return response.data
}

/*
 * GET method
 */

export const getUserCart = async (): Promise<CartResponse> => {
  const response = await api.get<CartResponse>('/carts/me')

  return response.data
}

/*
 * PUT method
 */

export const updateUserCartItemQtyByUuid = async (
  cartItemUuid: string,
  quantity: number
): Promise<CartResponse> => {
  const response = await api.put<CartResponse>(`/carts/me/items/${cartItemUuid}`, { quantity })

  return response.data
}

/*
 * DELETE
 */

export const removeUserCartItemByUuid = async (cartItemUuid: string): Promise<CartResponse> => {
  const response = await api.delete<CartResponse>(`/carts/me/items/${cartItemUuid}`)

  return response.data
}
