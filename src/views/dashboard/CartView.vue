<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useCartStore } from '@/stores/cartStore'

import CartList from '@/components/dashboard/cart/CartList.vue'
import CheckoutSummaryCard from '@/components/common/CheckoutSummaryCard.vue'

const router = useRouter()

const cartStore = useCartStore()
const { isLoading, cart } = storeToRefs(cartStore)
const { fetchUserCart } = cartStore

const onNavigateToProducts = () => {
  router.push({ name: 'products' })
}

const proceedToOrder = () => {
  router.push({ name: 'order' })
}

onMounted(() => {
  fetchUserCart()
})
</script>

<template>
  <v-layout width="70%" max-width="75rem" class="d-flex flex-column mx-auto py-8">
    <!-- Title -->
    <div class="w-100 text-h5 text-primary font-weight-bold text-center">My Shopping Cart</div>
    <!-- Cart items -->
    <div class="w-100 d-flex align-center mx-auto mt-8">
      <!-- Loader -->
      <v-skeleton v-if="isLoading">
        <v-skeleton-loader type="table" min-height="100px" />
      </v-skeleton>
      <!-- Result :  Success but not found -->
      <div
        v-else-if="!cart || !cart.items || cart.items.length === 0"
        class="w-100 d-flex flex-column justify-center align-center ga-1 border-sm rounded-lg"
        style="min-height: 20rem"
      >
        <v-icon icon="mdi-cart-remove" size="x-large" color="secondary" />
        <div class="text-subtitle-2 text-secondary mt-2 mb-6">Your cart is empty</div>
        <div class="justify-center">
          <v-btn
            variant="tonal"
            color="info"
            class="px-3 text-subtitle-2"
            @click="onNavigateToProducts"
            >Return to shop</v-btn
          >
        </div>
      </div>
      <!-- Result : Success -->
      <v-container v-else fluid class="pa-0">
        <v-row no-gutters class="fill-height">
          <!-- Cart items -->
          <v-col cols="12" sm="8" md="8" lg="8" xl="8">
            <CartList :items="cart.items" @navigate="onNavigateToProducts" />
          </v-col>
          <!-- Cart total -->
          <v-col cols="12" sm="4" md="4" lg="4" xl="4">
            <CheckoutSummaryCard
              :cart="cart"
              title="Cart Total"
              button-text="Proceed to order"
              button-type="button"
              @button-click="proceedToOrder"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-layout>
</template>

<style scoped></style>
