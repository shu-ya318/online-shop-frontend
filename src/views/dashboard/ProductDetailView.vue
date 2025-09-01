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

// TODO: remove mock data
// const mockProducts: ProductDetailResponse[] = [
//   {
//     uuid: 'prod-001',
//     name: '新鲜有机胡萝卜',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-15T10:30:00Z'),
//     sku: 'CARROT-001',
//     price: 25.99,
//     discountedPrice: 23.39,
//     discountPercentage: 10,
//     description: '农场直供的新鲜有机胡萝卜，富含维生素A和胡萝卜素',
//     category: 'vegetables',
//     stock: 150,
//     totalSold: 89,
//     imageUrl: '/src/assets/images/vegetables.png',
//   },
//   {
//     uuid: 'prod-002',
//     name: '红富士苹果',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-14T09:15:00Z'),
//     sku: 'APPLE-002',
//     price: 35.5,
//     discountedPrice: 30.17,
//     discountPercentage: 15,
//     description: '精选红富士苹果，脆甜多汁，营养丰富',
//     category: 'fruits',
//     stock: 200,
//     totalSold: 156,
//     imageUrl: '/src/assets/images/fruits.png',
//   },
//   {
//     uuid: 'prod-003',
//     name: '有机鸡胸肉',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-13T14:20:00Z'),
//     sku: 'CHICKEN-003',
//     price: 45.99,
//     discountedPrice: 36.79,
//     discountPercentage: 20,
//     description: '无激素有机鸡胸肉，高蛋白低脂肪',
//     category: 'protein',
//     stock: 80,
//     totalSold: 234,
//     imageUrl: '/src/assets/images/protein.png',
//   },
//   {
//     uuid: 'prod-004',
//     name: '全麦面包',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-12T11:45:00Z'),
//     sku: 'BREAD-004',
//     price: 18.99,
//     discountedPrice: 17.09,
//     discountPercentage: 5,
//     description: '100%全麦制作，富含膳食纤维',
//     category: 'grains',
//     stock: 120,
//     totalSold: 67,
//     imageUrl: '/src/assets/images/grains.png',
//   },
//   {
//     uuid: 'prod-005',
//     name: '新鲜菠菜',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-11T16:30:00Z'),
//     sku: 'SPINACH-005',
//     price: 12.99,
//     discountedPrice: 12.99,
//     discountPercentage: 0,
//     description: '绿叶蔬菜，富含铁质和维生素C',
//     category: 'vegetables',
//     stock: 95,
//     totalSold: 123,
//     imageUrl: '/src/assets/images/vegetables.png',
//   },
//   {
//     uuid: 'prod-006',
//     name: '香蕉',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-10T08:20:00Z'),
//     sku: 'BANANA-006',
//     price: 15.5,
//     discountedPrice: 15.5,
//     discountPercentage: 10,
//     description: '天然甜味，富含钾元素',
//     category: 'fruits',
//     stock: 180,
//     totalSold: 198,
//     imageUrl: '/src/assets/images/fruits.png',
//   },
//   {
//     uuid: 'prod-007',
//     name: '三文鱼片',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-09T13:10:00Z'),
//     sku: 'SALMON-007',
//     price: 89.99,
//     discountedPrice: 67.49,
//     discountPercentage: 25,
//     description: '新鲜三文鱼片，富含Omega-3脂肪酸',
//     category: 'protein',
//     stock: 45,
//     totalSold: 78,
//     imageUrl: '/src/assets/images/protein.png',
//   },
//   {
//     uuid: 'prod-008',
//     name: '燕麦片',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-08T10:00:00Z'),
//     sku: 'OAT-008',
//     price: 22.99,
//     discountedPrice: 20.09,
//     discountPercentage: 12,
//     description: '即食燕麦片，营养早餐首选',
//     category: 'grains',
//     stock: 110,
//     totalSold: 145,
//     imageUrl: '/src/assets/images/grains.png',
//   },
//   {
//     uuid: 'prod-009',
//     name: '西兰花',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-07T15:45:00Z'),
//     sku: 'BROCCOLI-009',
//     price: 19.99,
//     discountedPrice: 18.39,
//     discountPercentage: 8,
//     description: '绿色蔬菜，富含维生素C和叶酸',
//     category: 'vegetables',
//     stock: 75,
//     totalSold: 92,
//     imageUrl: '/src/assets/images/vegetables.png',
//   },
//   {
//     uuid: 'prod-010',
//     name: '橙子',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-06T12:30:00Z'),
//     sku: 'ORANGE-010',
//     price: 28.5,
//     discountedPrice: 24.22,
//     discountPercentage: 15,
//     description: '新鲜橙子，富含维生素C',
//     category: 'fruits',
//     stock: 160,
//     totalSold: 167,
//     imageUrl: '/src/assets/images/fruits.png',
//   },
//   {
//     uuid: 'prod-011',
//     name: '鸡蛋',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-05T09:15:00Z'),
//     sku: 'EGG-011',
//     price: 32.99,
//     discountedPrice: 30.34,
//     discountPercentage: 5,
//     description: '农场新鲜鸡蛋，富含优质蛋白质',
//     category: 'protein',
//     stock: 200,
//     totalSold: 289,
//     imageUrl: '/src/assets/images/protein.png',
//   },
//   {
//     uuid: 'prod-012',
//     name: '糙米',
//     availabilityStatus: 'IN_STOCK',
//     updatedAt: new Date('2024-01-04T14:20:00Z'),
//     sku: 'RICE-012',
//     price: 26.99,
//     discountedPrice: 24.29,
//     discountPercentage: 10,
//     description: '有机糙米，保留完整营养',
//     category: 'grains',
//     stock: 85,
//     totalSold: 134,
//     imageUrl: '/src/assets/images/grains.png',
//   },
// ]

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

// TODO: remove mock data logic
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
        <!-- Image -->
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-img
            width="300"
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
                <div class="text-h4 text-primary font-weight-bold">
                  {{ productDetail.name ?? '--' }}
                </div>
                <div class="text-subtitle-2 text-primary">
                  SKU:<span class="text-secondary ml-2">{{ productDetail.sku ?? '--' }}</span>
                </div>
              </div>
              <div class="text-h6 text-primary font-weight-bold">
                ${{ productDetail.discountPrice }}
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
                  class="text-body-1 text-primary"
                >
                  {{ key }}: <span class="text-secondary ml-2">{{ value }}</span>
                </div>
              </div>
            </div>
            <!-- Add to cart -->
            <div class="d-flex ga-3 align-center mt-6" style="height: 3rem">
              <AddToCartControls
                :product-quantity="productQuantity"
                :on-increment="IncreaseQuantity"
                :on-decrement="decreaseQuantity"
              />
              <!-- Submit -->
              <v-btn color="success" append-icon="mdi-cart" size="x-large" class="flex-grow-1"
                >Add to cart</v-btn
              >
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
