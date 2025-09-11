import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { hasDiscount } from '@/utils/hasDiscount'

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

  const cartSubtotal = computed(() => {
    if (!cart.value) return 0

    return cart.value.items.reduce((total, item) => {
      const itemPrice = hasDiscount(item) ? item.discountPrice : item.price

      return total + Math.round(itemPrice * item.quantity)
    }, 0)
  })

  const cartShipping = computed(() => {
    return cartSubtotal.value >= 300 ? 0 : 60
  })

  const cartTotal = computed(() => {
    return cartSubtotal.value + cartShipping.value
  })

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
    // getters
    cartSubtotal,
    cartShipping,
    cartTotal,
    // actions
    fetchUserCart,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
  }
})
