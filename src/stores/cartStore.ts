import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import {
  addCartItem as apiAddCartItem,
  getUserCart,
  updateCartItemQuantity as apiUpdateCartItemQuantity,
  removeCartItem as apiRemoveCartItem,
} from '@/api/cart'

import type {
  AddCartItemRequest,
  CartResponse,
  UpdateCartItemQuantityRequest,
} from '@/api/cart/interface'

export const useCartStore = defineStore('cart', () => {
  const isLoading = ref(true)
  const cart = ref<CartResponse | null>(null)

  const cartSubtotal = computed(() => {
    if (!cart.value) return 0

    return cart.value.items.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  const cartShipping = computed(() => {
    return cartSubtotal.value >= 300 ? 0 : 60
  })

  const cartTotal = computed(() => {
    return cartSubtotal.value + cartShipping.value
  })

  const fetchUserCart = async (): Promise<void> => {
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

  const addCartItem = async (request: AddCartItemRequest): Promise<void> => {
    if (!cart.value) throw new Error('Cart not found')

    isLoading.value = true
    try {
      const { productUuid, quantity } = request

      const existingItem = cart.value.items.find((item) => item.productUuid === productUuid)
      if (existingItem) {
        const response = await apiUpdateCartItemQuantity({
          productUuid,
          quantity: existingItem.quantity + quantity,
        })
        cart.value = response
      } else {
        const response = await apiAddCartItem({ productUuid, quantity })
        cart.value = response
      }
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateCartItemQuantity = async (request: UpdateCartItemQuantityRequest): Promise<void> => {
    if (!cart.value) throw new Error('Cart not found')

    const hasItem = cart.value.items.some((item) => item.productUuid === request.productUuid)
    if (!hasItem) throw new Error('Item not found')

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
    if (!cart.value) throw new Error('Cart not found')

    const hasItem = cart.value.items.some((item) => item.productUuid === productUuid)
    if (!hasItem) throw new Error('Item not found')

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
