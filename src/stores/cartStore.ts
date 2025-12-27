import { ref } from 'vue'
import { defineStore } from 'pinia'

import {
  addUserCartItem as apiAddUserCartItem,
  getUserCart as apiGetUserCart,
  updateUserCartItemQtyByUuid as apiUpdateUserCartItemQtyByUuid,
  removeUserCartItemByUuid as apiRemoveUserCartItemByUuid,
} from '@/api/cart'

import type { CartItemAddRequest, CartResponse } from '@/api/cart/interface'

export const useCartStore = defineStore('cart', () => {
  const isLoading = ref(false)
  const cart = ref<CartResponse | null>(null)

  const getUserCart = async (): Promise<void> => {
    isLoading.value = true

    try {
      const response = await apiGetUserCart()
      cart.value = response
    } catch (error) {
      cart.value = null
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addUserCartItem = async (request: CartItemAddRequest): Promise<void> => {
    isLoading.value = true

    try {
      const response = await apiAddUserCartItem(request)
      cart.value = response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateUserCartItemQtyByUuid = async (cartItemUuid: string, quantity: number): Promise<void> => {
    isLoading.value = true

    try {
      const response = await apiUpdateUserCartItemQtyByUuid(cartItemUuid, quantity)
      cart.value = response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const removeUserCartItemByUuid = async (cartItemUuid: string): Promise<void> => {
    isLoading.value = true

    try {
      const response = await apiRemoveUserCartItemByUuid(cartItemUuid)
      cart.value = response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    // state
    isLoading,
    cart,
    // actions
    getUserCart,
    addUserCartItem,
    updateUserCartItemQtyByUuid,
    removeUserCartItemByUuid,
  }
})
