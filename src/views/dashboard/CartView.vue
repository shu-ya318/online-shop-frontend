<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'

import { useCartStore } from '@/stores/cartStore'
import { useNotification } from '@/composables/useNotification'

import CartList from '@/components/dashboard/cart/CartList.vue'
import CheckoutSummaryCard from '@/components/common/CheckoutSummaryCard.vue'

const { showSnackbar, snackbarColor, resultMessage, showError, showSuccess } = useNotification()

const router = useRouter()

const {
  isLoading,
  cart,
  removeCartItem,
  cartSubtotal,
  cartShipping,
  cartTotal,
  updateCartItemQuantity,
} = useCartStore()

const isOpen = ref(false)

const updateItemQuantity = debounce(async (payload: { productUuid: string; quantity: number }) => {
  try {
    await updateCartItemQuantity(payload)
    showSuccess('Update quantity successfully!')
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  }
}, 1000)

const openWarningDialog = () => {
  isOpen.value = true
}

const closeWarningDialog = () => {
  isOpen.value = false
}

const removeItemFromCart = async (productUuid: string) => {
  try {
    await removeCartItem(productUuid)
    showSuccess('Remove item successfully!')
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  }
}

const NavigateToProducts = () => {
  router.push({ name: 'products' })
}

const proceedToOrder = () => {
  router.push({ name: 'order' })
}
</script>

<template>
  <v-layout width="70%" max-width="75rem" class="d-flex flex-column mx-auto py-8">
    <!-- Title -->
    <div class="w-100 text-h5 text-primary font-weight-bold text-center">My Shopping Cart</div>
    <!-- Cart items -->
    <div class="w-100 d-flex align-center mx-auto mt-8">
      <!-- Loader -->
      <v-skeleton v-if="isLoading">
        <v-col cols="12" sm="8" md="8" lg="8" xl="8">
          <v-skeleton-loader type="table-row" height="100px" />
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="4" xl="4">
          <v-skeleton-loader type="table-row" height="100px" />
        </v-col>
      </v-skeleton>
      <!-- Result :  Success but not found -->
      <div
        v-else-if="!cart || cart.items.length === 0"
        class="w-100 d-flex flex-column justify-center align-center ga-1"
        style="min-height: 15rem"
      >
        <v-icon icon="mdi-cart-remove" size="x-large" color="secondary" />
        <div class="text-subtitle-2 text-secondary">Your cart is empty</div>
      </div>
      <!-- Result : Success -->
      <v-container v-else fluid class="pa-0">
        <v-row no-gutters class="fill-height">
          <!-- Cart items -->
          <v-col cols="12" sm="8" md="8" lg="8" xl="8">
            <CartList
              :items="cart.items"
              :is-open="isOpen"
              @navigate="NavigateToProducts"
              @open-dialog="openWarningDialog"
              @close-dialog="closeWarningDialog"
              @remove-item="removeItemFromCart"
              @update-item-quantity="updateItemQuantity"
            />
          </v-col>
          <!-- Cart total -->
          <v-col cols="12" sm="4" md="4" lg="4" xl="4">
            <CheckoutSummaryCard
              title="Cart Total"
              button-text="Proceed to order"
              :shipping="cartShipping === 0 ? 'Free' : cartShipping"
              :subtotal="cartSubtotal"
              :total="cartTotal"
              @button-click="proceedToOrder"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-layout>
  <!-- Snackbar -->
  <v-snackbar timeout=" 3000" location="top" :color="snackbarColor" v-model="showSnackbar">
    {{ resultMessage }}
  </v-snackbar>
</template>

<style scoped></style>
