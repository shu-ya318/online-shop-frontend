<script setup lang="ts">
import AddToCartControls from '@/components/common/AddToCartControls.vue'

import type { CartItem } from '@/api/cart/interface'

defineProps<{
  items: CartItem[]
  isOpen: boolean
}>()
defineEmits<{
  (event: 'open-dialog'): void
  (event: 'close-dialog'): void
  (event: 'removeItem', productUuid: string): void
  (event: 'updateItemQuantity', payload: { productUuid: string; quantity: number }): void
  (event: 'navigate'): void
}>()
</script>

<template>
  <v-card class="border-sm border-info mr-6" style="min-height: 16.875rem">
    <!-- Title -->
    <v-row class="d-none d-md-flex px-4 py-2 text-subtitle-1 text-grey">
      <v-col md="4" class="font-weight-bold">Product</v-col>
      <v-col md="2" class="font-weight-bold">Price</v-col>
      <v-col md="3" class="font-weight-bold">Quantity</v-col>
      <v-col md="2" class="font-weight-bold">Subtotal</v-col>
      <v-col md="1"></v-col>
    </v-row>
    <v-divider color="info"></v-divider>
    <!-- Empty Item -->
    <div
      v-if="!items.length"
      class="w-100 d-flex flex-column justify-center align-center ga-1"
      style="min-height: 20rem"
    >
      <v-icon icon="mdi-cart-remove" size="x-large" color="secondary" />
      <div class="text-subtitle-2 text-secondary">Your cart is empty</div>
    </div>
    <!-- Items -->
    <template v-else>
      <template v-for="(item, index) in items" :key="item.productUuid">
        <v-row align="center" class="pa-4">
          <!-- Product -->
          <v-col cols="12" md="4">
            <div class="d-flex align-center">
              <v-img
                :src="item.imageUrl"
                :alt="item.productName"
                width="80"
                height="80"
                class="mr-4 rounded"
              ></v-img>
              <span class="text-body-1 text-primary">{{ item.productName }}</span>
            </div>
          </v-col>
          <!-- Price -->
          <v-col cols="4" md="2">
            <!-- <div class="d-md-none text-overline text-grey">$</div> -->
            <div class="text-body-1 text-primary">${{ item.price }}</div>
          </v-col>
          <!-- Quantity -->
          <v-col cols="8" md="3">
            <AddToCartControls
              :product-quantity="item.quantity"
              @on-increment="
                $emit('updateItemQuantity', {
                  productUuid: item.productUuid,
                  quantity: item.quantity + 1,
                })
              "
              @on-decrement="
                $emit('updateItemQuantity', {
                  productUuid: item.productUuid,
                  quantity: item.quantity - 1,
                })
              "
            />
          </v-col>
          <!-- Subtotal -->
          <v-col cols="12" md="2" class="position-relative">
            <!-- <div class="d-md-none text-overline text-grey mt-4">Subtotal</div> -->
            <div class="text-subtitle-1 text-primary">
              ${{ item.discountPrice * item.quantity }}
            </div>
          </v-col>
          <!-- Remove button -->
          <v-col cols="12" md="1">
            <v-btn
              icon="mdi-trash-can-outline"
              variant="text"
              @click="$emit('open-dialog')"
            ></v-btn>
            <!-- Warning Dialog -->
            <v-dialog :model-value="isOpen" width="500">
              <v-card>
                <v-card-title>Remove Item</v-card-title>
                <v-card-text>Are you sure you want to remove {{ item.productName }}?</v-card-text>
                <v-card-actions>
                  <v-btn color="error" @click="$emit('removeItem', item.productUuid)">Remove</v-btn>
                  <v-btn @click="$emit('close-dialog')">Cancel</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <v-divider v-if="index < items.length - 1"></v-divider>
      </template>
    </template>
    <!-- Return to products page -->
    <v-card-actions class="justify-center">
      <v-btn variant="tonal" color="info" class="px-4 text-subtitle-2" @click="$emit('navigate')"
        >Return to shop</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
