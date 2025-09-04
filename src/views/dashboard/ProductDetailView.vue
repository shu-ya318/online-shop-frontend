<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useNotification } from '@/composables/useNotification'

import AddToCartControls from '@/components/common/AddToCartControls.vue'

import { getProductByUuid } from '@/api/product'

import type { ProductDetailRequest, ProductDetailResponse } from '@/api/product/interface'

const { showSnackbar, snackbarColor, resultMessage, showError } = useNotification()

const route = useRoute()

const isLoading = ref(true)
const productDetail = ref<ProductDetailResponse | null>(null)

const productQuantity = ref(1)

const productSpecifications = computed(() => {
  if (!productDetail.value) {
    return {}
  }

  return {
    Category: productDetail.value.category,
    'Total Sold': productDetail.value.totalSold,
    'Stock Status': productDetail.value.availabilityStatus,
  }
})

const fetchProductDetail = async (params: ProductDetailRequest) => {
  if (!params.uuid) {
    showError('Product uuid is missing')
    return
  }

  try {
    const response = await getProductByUuid(params)
    productDetail.value = response
    console.log(productDetail.value.imageUrl)
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
  fetchProductDetail({ uuid: route.params.productUuid as string })
})

const IncreaseQuantity = () => {
  if (productDetail.value?.availabilityStatus === 'IN_STOCK') {
    productQuantity.value++
  } else {
    showError('Please select the quantity under the stock')
  }
}

const decreaseQuantity = () => {
  if (productQuantity.value > 1) {
    productQuantity.value--
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
    <!-- Result : Not found -->
    <div v-else-if="!productDetail" class="w-100 d-flex flex-column justify-center align-center ga-1"
      style="min-height: 20rem">
      <v-icon icon="mdi-alert-circle-outline" size="x-large" color="secondary" />
      <div class="text-subtitle-2 text-secondary">No product found</div>
    </div>
    <!-- Result : Success -->
    <v-container v-else class="w-100 d-flex">
      <v-row>
        <v-col cols="12" md="4" class="d-flex justify-center">
          <!-- Image -->
          <v-img :width="300" height="300" :src="productDetail.imageUrl" :alt="productDetail.name" class="mx-auto">
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
                <template v-if="productDetail.discountPrice">
                  ${{ Math.round(productDetail.discountPrice) }}
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
                <div v-for="(value, key) in productSpecifications" :key="key" class="text-body-1 text-primary">
                  {{ key }}: <span class="text-secondary ml-2">{{ value }}</span>
                </div>
              </div>
            </div>
            <!-- Add to cart -->
            <div class="d-flex ga-3 align-center mt-6" style="height: 3rem">
              <AddToCartControls :product-quantity="productQuantity" :on-increment="IncreaseQuantity"
                :on-decrement="decreaseQuantity" />
              <!-- Submit -->
              <v-btn color="success" append-icon="mdi-cart" size="x-large" class="flex-grow-1">Add to cart</v-btn>
            </div>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <!-- Snackbar -->
    <v-snackbar timeout=" 3000" location="top" :color="snackbarColor" v-model="showSnackbar">
      {{ resultMessage }}
    </v-snackbar>
  </v-layout>
</template>

<style scoped></style>
