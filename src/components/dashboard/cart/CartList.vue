<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'lodash/debounce'

import { useNotificationStore } from '@/stores/notificationStore'
import { useCartStore } from '@/stores/cartStore'
import { hasDiscount as cartItemHasDiscount } from '@/utils/hasDiscount'

import AddToCartControls from '@/components/common/AddToCartControls.vue'

import type { CartItem } from '@/api/cart/interface'

defineProps<{
  items: CartItem[]
}>()

defineEmits<{
  (event: 'navigate'): void
}>()

const { showError, showSuccess } = useNotificationStore()

const { updateCartItemQuantity, removeCartItem } = useCartStore()

const isOpen = ref(false)
const selectedItemUuid = ref('')
const updatingItemUuid = ref<string | null>(null)

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
  } finally {
    updatingItemUuid.value = null
  }
}, 1000)

const handleQuantityChange = (productUuid: string, quantity: number) => {
  updatingItemUuid.value = productUuid
  updateItemQuantity({ productUuid, quantity })
}

const openDialog = (productUuid: string) => {
  selectedItemUuid.value = productUuid
  isOpen.value = true
}

const closeDialog = () => {
  isOpen.value = false
  selectedItemUuid.value = ''
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
    <!-- Items -->
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
              contain
              class="mr-4 rounded"
            >
              <template #error>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-icon icon="mdi-image-remove-outline" size="x-large" color="grey-lighten-1" />
                </v-row>
              </template>
            </v-img>
            <span class="text-body-1 text-primary">{{ item.productName ?? '--' }}</span>
          </div>
        </v-col>
        <!-- Price -->
        <v-col cols="4" md="2">
          <div class="text-body-1 text-primary">
            <template v-if="cartItemHasDiscount(item)">
              <span class="text-decoration-line-through text-grey-darken-1 mr-1">
                ${{ Math.round(item.price) ?? '--' }}
              </span>
              <span class="font-weight-bold">${{ Math.round(item.discountPrice) ?? '--' }}</span>
            </template>
            <template v-else> ${{ Math.round(item.price) ?? '--' }} </template>
          </div>
        </v-col>
        <!-- Quantity -->
        <v-col cols="8" md="3">
          <AddToCartControls
            :selected-quantity="item.quantity"
            :is-loading="updatingItemUuid === item.productUuid"
            @on-increment="handleQuantityChange(item.productUuid, item.quantity + 1)"
            @on-decrement="handleQuantityChange(item.productUuid, item.quantity - 1)"
          />
        </v-col>
        <!-- Subtotal -->
        <v-col cols="12" md="2" class="position-relative">
          <!-- <div class="d-md-none text-overline text-grey mt-4">Subtotal</div> -->
          <div class="text-subtitle-1 text-primary">
            ${{
              cartItemHasDiscount(item)
                ? Math.round(item.discountPrice) * item.quantity
                : Math.round(item.price) * item.quantity
            }}
          </div>
        </v-col>
        <!-- Remove button -->
        <v-col cols="12" md="1">
          <v-btn
            icon="mdi-trash-can-outline"
            variant="text"
            @click="openDialog(item.productUuid)"
          ></v-btn>
          <!-- Warning Dialog -->
          <v-dialog :model-value="isOpen && selectedItemUuid === item.productUuid" width="500">
            <v-card class="py-3 px-4">
              <v-card-title class="py-1">Remove Item</v-card-title>
              <v-card-text class="pt-1 pb-5">
                Are you sure you want to remove {{ item.productName }}?
              </v-card-text>
              <v-card-actions>
                <v-btn color="info" class="px-2" @click="closeDialog">Cancel</v-btn>
                <v-btn color="error" class="px-2" @click="removeItemFromCart(item.productUuid)"
                  >Remove</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider v-if="index < items.length - 1"></v-divider>
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
