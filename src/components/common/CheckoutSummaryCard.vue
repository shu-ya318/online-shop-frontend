<script setup lang="ts">
import type { CartResponse as Cart } from '@/api/cart/interface'

defineProps<{
  title: string
  cart: Cart
}>()
</script>

<template>
  <v-card class="border-sm border-info pa-6">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <!-- Cart Items -->
      <slot name="items"></slot>
      <!-- Charge -->
      <div class="mt-5 mb-5">
        <!-- Subtotal -->
        <div class="d-flex justify-space-between text-body-2 text-secondary mb-2">
          <span>Subtotal:</span>
          <span class="text-primary">${{ cart.subtotal }}</span>
        </div>
        <v-divider color="info" class="my-2"></v-divider>
        <!-- Shipping -->
        <div class="d-flex justify-space-between text-body-2 text-secondary mb-2">
          <span>Shipping:</span>
          <span class="text-primary">
            {{ cart.shipping > 0 ? `$${cart.shipping}` : 'Free' }}
          </span>
        </div>
        <v-divider color="info" class="my-2"></v-divider>
        <!-- Total -->
        <div class="d-flex justify-space-between text-subtitle-1 text-secondary">
          <span>Total:</span>
          <span class="text-primary font-weight-bold">${{ cart.total }}</span>
        </div>
      </div>
      <!-- Payment Method -->
      <slot name="payment-method"></slot>
    </v-card-text>
    <!-- Button -->
    <v-card-actions>
      <slot name="button"></slot>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
