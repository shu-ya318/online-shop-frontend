<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/userStore'
import { useCartStore } from '@/stores/cartStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { hasDiscount as productHasDiscount } from '@/utils/hasDiscount'

import AddToCartControls from '@/components/common/AddToCartControls.vue'

import { getProductByUuid } from '@/api/product'

import { AvailabilityStatus } from '@/types/common/enum'
import type { ProductDetailResponse } from '@/api/product/interface'

const { showError, showSuccess } = useNotificationStore()

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)

const { addCartItem, isLoading: isAddingToCart } = useCartStore()

const isLoading = ref(true)
const productDetail = ref<ProductDetailResponse | null>(null)

const selectedQuantity = ref(1)

const hasDiscount = computed(() => productHasDiscount(productDetail.value))

const productSpecifications = computed(() => {
  if (!productDetail.value) return {}

  const { category, totalSold, availabilityStatus } = productDetail.value

  return {
    Category: category.toLowerCase(),
    'Total Sold': totalSold,
    'Stock Status':
      availabilityStatus === AvailabilityStatus.IN_STOCK ? 'Available' : 'Unavailable',
  }
})

const fetchProductDetail = async (values: string) => {
  if (!values) {
    showError('Product uuid is missing')
    return
  }

  try {
    const response = await getProductByUuid(values)
    productDetail.value = response
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProductDetail(route.params.productUuid as string)
})

const IncreaseQuantity = () => {
  if (productDetail.value?.availabilityStatus === AvailabilityStatus.IN_STOCK) {
    selectedQuantity.value++
  } else {
    showError('Please select the quantity under the stock!')
  }
}

const decreaseQuantity = () => {
  if (selectedQuantity.value > 1) selectedQuantity.value--
}

const addItemToCart = async (productUuid: string) => {
  if (!isAuthenticated.value) {
    router.push({ name: 'login' })
    return
  }

  try {
    await addCartItem({ productUuid, quantity: selectedQuantity.value })
    showSuccess('Add to cart successfully!')
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
  <v-layout width="70%" max-width="75rem" class="d-flex flex-column mx-auto py-8">
    <!-- Loader -->
    <v-container v-if="isLoading" class="w-100 d-flex">
      <v-row>
        <v-col :cols="12" :md="6">
          <v-skeleton-loader type="image" height="400"></v-skeleton-loader>
        </v-col>
        <v-col :cols="12" :md="6">
          <v-skeleton-loader type="article, actions"></v-skeleton-loader>
          <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
    <!-- Result : Success but Not found -->
    <div
      v-else-if="!productDetail"
      class="w-100 d-flex flex-column justify-center align-center ga-1"
      style="min-height: 20rem"
    >
      <v-icon icon="mdi-alert-circle-outline" size="x-large" color="secondary" />
      <div class="text-subtitle-2 text-secondary">No product found</div>
    </div>
    <!-- Result : Success -->
    <v-container v-else class="w-100 d-flex">
      <v-row>
        <v-col cols="12" md="4" class="d-flex justify-center">
          <!-- Image -->
          <v-img
            :width="300"
            height="300"
            :src="productDetail.imageUrl"
            :alt="productDetail.name"
            class="mx-auto"
          >
            <template #error>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-icon icon="mdi-image-remove-outline" size="x-large" color="grey-lighten-1" />
              </v-row>
            </template>
          </v-img>
        </v-col>
        <!-- Info and actions -->
        <v-col cols="12" md="8">
          <v-container class="d-flex flex-column pa-0 ga-6">
            <!-- Title -->
            <div class="d-flex flex-column ga-5">
              <div class="d-flex flex-column ga-3">
                <!-- Name -->
                <div class="text-h4 text-primary font-weight-bold">
                  {{ productDetail.name ?? '--' }}
                </div>
                <!-- SKU -->
                <div class="text-subtitle-2 text-primary">
                  SKU:<span class="text-secondary ml-2">{{ productDetail.sku ?? '--' }}</span>
                </div>
              </div>
              <!-- Price -->
              <div class="text-h6 text-primary font-weight-bold">
                <template v-if="hasDiscount">
                  ${{ Math.round(productDetail.discountPrice) ?? '--' }}
                  <span class="ml-2 text-info text-decoration-line-through">
                    ${{ Math.round(productDetail.price) ?? '--' }}
                  </span>
                </template>
                <template v-else> ${{ Math.round(productDetail.price) ?? '--' }} </template>
              </div>
              <v-divider color="info" :thickness="2"></v-divider>
            </div>
            <!-- Description -->
            <div class="text-body-1 text-secondary">{{ productDetail.description ?? '--' }}</div>
            <!-- specification -->
            <div class="d-flex flex-column ga-6">
              <v-divider color="info" :thickness="2"></v-divider>
              <div class="d-flex flex-column ga-3">
                <div
                  v-for="(value, key) in productSpecifications"
                  :key="key"
                  class="text-body-1 text-primary d-flex align-center ga-2"
                >
                  {{ key }}:
                  <template v-if="key === 'Category'">
                    <v-chip size="small">{{ value }}</v-chip>
                  </template>
                  <template v-else-if="key === 'Stock Status'">
                    <v-chip size="small" :color="value === 'Available' ? 'success' : 'error'">
                      {{ value }}
                    </v-chip>
                  </template>
                  <template v-else>
                    <span class="text-secondary ml-2">{{ value }}</span>
                  </template>
                </div>
              </div>
            </div>
            <!-- Add to cart -->
            <div class="d-flex ga-3 align-center mt-6" style="height: 3rem">
              <AddToCartControls
                :selected-quantity="selectedQuantity"
                :stock="productDetail?.stock || 0"
                @on-increment="IncreaseQuantity"
                @on-decrement="decreaseQuantity"
              />
              <!-- Submit -->
              <v-btn
                color="success"
                append-icon="mdi-cart"
                size="x-large"
                class="flex-grow-1"
                :loading="isAddingToCart"
                :disabled="
                  productDetail.availabilityStatus === AvailabilityStatus.OUT_OF_STOCK ||
                  productDetail.stock < selectedQuantity ||
                  isAddingToCart
                "
                @click="addItemToCart(productDetail.uuid)"
                >Add to cart</v-btn
              >
            </div>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<style scoped></style>
