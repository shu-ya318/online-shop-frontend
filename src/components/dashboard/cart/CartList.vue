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

const { updateUserCartItemQtyByUuid, removeUserCartItemByUuid } = useCartStore()

const isOpen = ref(false)
const selectedCartItemUuid = ref('')
const updatingCartItemUuid = ref<string | null>(null)

const updateItemQty = debounce(async (payload: { cartItemUuid: string; quantity: number }) => {
  try {
    await updateUserCartItemQtyByUuid(payload.cartItemUuid, payload.quantity)
    showSuccess('Update quantity successfully!')
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  } finally {
    updatingCartItemUuid.value = null
  }
}, 1000)

const ChangeCartItemQty = (cartItemUuid: string, quantity: number) => {
  updatingCartItemUuid.value = cartItemUuid
  updateItemQty({ cartItemUuid, quantity })
}

const openDialog = (cartItemUuid: string) => {
  selectedCartItemUuid.value = cartItemUuid
  isOpen.value = true
}

const closeDialog = () => {
  isOpen.value = false
  selectedCartItemUuid.value = ''
}

const removeItemFromCart = async (cartItemUuid: string) => {
  try {
    await removeUserCartItemByUuid(cartItemUuid)
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
  <v-card class="border-sm border-info mr-md-6 mb-6 mb-md-0" style="min-height: 16.875rem">
    <!-- Title -->
    <v-row class="d-none d-lg-flex px-4 py-2 text-subtitle-1 text-grey">
      <v-col cols="4" class="font-weight-bold">Product</v-col>
      <v-col cols="2" class="font-weight-bold">Price</v-col>
      <v-col cols="3" class="font-weight-bold">Quantity</v-col>
      <v-col cols="2" class="font-weight-bold">Subtotal</v-col>
      <v-col cols="1"></v-col>
    </v-row>
    <v-divider color="info" class="d-none d-lg-block"></v-divider>
    <!-- Items -->
    <template v-for="(item, index) in items" :key="item.cartItemUuid"> 
      <!-- Layout -->     
      <v-row class="pa-4 d-flex d-lg-none" align="start">
        <!-- Image Content (Left) -->
        <v-col cols="auto">
             <v-img
              :src="item.imageUrl"
              :alt="item.productName"
              width="120"
              height="120"
              cover
              class="rounded bg-grey-lighten-4"
            >
              <template #error>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-icon icon="mdi-image-remove-outline" size="large" color="grey-lighten-1" />
                </v-row>
              </template>
            </v-img>
        </v-col>
        <!-- Info Content (Right) -->
        <v-col class="d-flex flex-column">
             <div class="d-flex justify-space-between align-start mb-2">
                 <span class="text-body-1 font-weight-bold text-primary mr-2 text-truncate">{{ item.productName ?? '--' }}</span>
                 <v-btn
                    icon="mdi-trash-can-outline"
                    variant="text"
                    size="small"
                    color="grey"
                    @click="openDialog(item.cartItemUuid)"
                  ></v-btn>
             </div>

             <!-- Price -->
             <div class="mb-4">
               <template v-if="cartItemHasDiscount(item)">
                  <span class="text-decoration-line-through text-caption text-grey mr-2">
                    ${{ Math.round(item.price) ?? '--' }}
                  </span>
                  <span class="text-body-2 font-weight-bold text-primary">${{ Math.round(item.discountPrice) ?? '--' }}</span>
               </template>
               <template v-else>
                  <span class="text-body-2 font-weight-bold text-primary">${{ Math.round(item.price) ?? '--' }}</span>
               </template>
             </div>

             <!-- Quantity and Subtotal -->
             <div class="d-flex align-center justify-space-between mt-auto">
                 <AddToCartControls
                    :selected-quantity="item.quantity"
                    :is-loading="updatingCartItemUuid === item.cartItemUuid"
                    @on-increment="ChangeCartItemQty(item.cartItemUuid, item.quantity + 1)"
                    @on-decrement="ChangeCartItemQty(item.cartItemUuid, item.quantity - 1)"
                  />
                  <div class="text-subtitle-1 font-weight-bold text-primary">
                    ${{
                      cartItemHasDiscount(item)
                        ? Math.round(item.discountPrice) * item.quantity
                        : Math.round(item.price) * item.quantity
                    }}
                  </div>
             </div>
        </v-col>
      </v-row>
      <!-- Desktop Layout -->
      <v-row align="center" class="pa-4 d-none d-lg-flex">
        <!-- Product -->
        <v-col cols="4">
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
        <v-col cols="2">
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
        <v-col cols="3">
          <AddToCartControls
            :selected-quantity="item.quantity"
            :is-loading="updatingCartItemUuid === item.cartItemUuid"
            @on-increment="ChangeCartItemQty(item.cartItemUuid, item.quantity + 1)"
            @on-decrement="ChangeCartItemQty(item.cartItemUuid, item.quantity - 1)"
          />
        </v-col>
        <!-- Subtotal -->
        <v-col cols="2" class="position-relative">
          <div class="text-subtitle-1 text-primary">
            ${{
              cartItemHasDiscount(item)
                ? Math.round(item.discountPrice) * item.quantity
                : Math.round(item.price) * item.quantity
            }}
          </div>
        </v-col>
        <!-- Remove button -->
        <v-col cols="1">
          <v-btn
            icon="mdi-trash-can-outline"
            variant="text"
            @click="openDialog(item.cartItemUuid)"
          ></v-btn>
        </v-col>
      </v-row>
      <!-- Delete Warning Dialog -->
      <v-dialog :model-value="isOpen && selectedCartItemUuid === item.cartItemUuid" width="500">
        <v-card class="py-3 px-4">
          <v-card-title class="py-1">Remove Item</v-card-title>
          <v-card-text class="pt-1 pb-5">
            Are you sure you want to remove {{ item.productName }}?
          </v-card-text>
          <v-card-actions>
            <v-btn color="info" class="px-2" @click="closeDialog">Cancel</v-btn>
            <v-btn color="error" class="px-2" @click="removeItemFromCart(item.cartItemUuid)"
              >Remove</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
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
