import { ref } from 'vue'
import { defineStore } from 'pinia'

import {
  addCartItem as apiAddCartItem,
  getUserCart,
  updateCartItemQuantity as apiUpdateCartItemQuantity,
  removeCartItem as apiRemoveCartItem,
} from '@/api/cart'

import type {
  CartAddItemRequest,
  CartResponse,
  CartItemQuantityUpdateRequest,
} from '@/api/cart/interface'

export const useCartStore = defineStore('cart', () => {
  const isLoading = ref(false)
  const cart = ref<CartResponse | null>(null)

  const fetchUserCart = async (): Promise<void> => {
    isLoading.value = true

    try {
      const response = await getUserCart()
      cart.value = response
    } catch (error) {
      cart.value = null
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addCartItem = async (request: CartAddItemRequest): Promise<void> => {
    isLoading.value = true

    try {
      const response = await apiAddCartItem(request)
      cart.value = response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateCartItemQuantity = async (request: CartItemQuantityUpdateRequest): Promise<void> => {
    isLoading.value = true

    try {
      const response = await apiUpdateCartItemQuantity(request)
      cart.value = response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const removeCartItem = async (productUuid: string): Promise<void> => {
    isLoading.value = true

    try {
      const response = await apiRemoveCartItem(productUuid)
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
    fetchUserCart,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
  }
})
