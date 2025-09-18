<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/userStore'
import { useCartStore } from '@/stores/cartStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useResponsiveCount } from '@/composables/useResponsiveCount'

import SearchBar from '@/components/dashboard/product/SearchBar.vue'
import FilterDropdowns from '@/components/dashboard/product/FilterDropdowns.vue'
import ProductCard from '@/components/dashboard/product/ProductCard.vue'

import { getProducts } from '@/api/product'

import { SortDirection } from '@/types/common'
import type { Category } from '@/types/common'
import type { ProductDetailResponse } from '@/api/product/interface'
import type { PaginatedRequest } from '@/types/common'

enum QueryOptionType {
  SORT = 'sort',
  FILTER = 'filter',
}

export interface QueryOption {
  type: QueryOptionType
  model: string | null
  placeholder: string
  items: string[] | { title: string; value: string }[]
}

const queryOptions = ref<QueryOption[]>([
  {
    type: QueryOptionType.FILTER,
    model: null,
    placeholder: 'Select Category',
    items: ['vegetables', 'fruits', 'protein', 'grains'],
  },
  {
    type: QueryOptionType.SORT,
    model: null,
    placeholder: 'Sort by: Sold',
    items: [
      { title: 'Most Sold', value: 'totalSold,desc' },
      { title: 'Least Sold', value: 'totalSold,asc' },
    ],
  },
  {
    type: QueryOptionType.SORT,
    model: null,
    placeholder: 'Sort by: Date',
    items: [
      { title: 'Latest', value: 'updatedAt,desc' },
      { title: 'Oldest', value: 'updatedAt,asc' },
    ],
  },
])

const router = useRouter()

const route = useRoute()

const { count } = useResponsiveCount()

const { showError, showSuccess } = useNotificationStore()

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)

const { addCartItem } = useCartStore()

const searchTerm = ref('')
const queryParams = reactive<PaginatedRequest>({
  filter: {
    category: route.query.category as string,
  },
  page: 0,
  size: 2, //固定，測試16
  sortBy: 'updatedAt',
  sortDirection: SortDirection.DESC,
})

const isLoading = ref(true)
const productData = ref<ProductDetailResponse[]>([])
const totalPages = ref(0)
const totalProductData = ref(0)

const currentDisplayPage = ref(1)

const fetchProductData = async () => {
  try {
    const response = await getProducts(queryParams)
    productData.value = response.content
    totalProductData.value = response.totalElements
    totalPages.value = response.totalPages
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

const SearchProductData = () => {
  queryParams.filter.keyword = searchTerm.value
  queryParams.page = 0
  currentDisplayPage.value = 1

  router.push({ query: {} })
}

const SelectProductData = (queryOption: QueryOption) => {
  if (queryOption.type === QueryOptionType.FILTER) {
    queryParams.filter.category = queryOption.model as Category
  } else if (queryOption.type === QueryOptionType.SORT) {
    if (!queryOption.model) return

    const [field, direction] = queryOption.model.split(',')
    queryParams.sortBy = field
    queryParams.sortDirection = direction as SortDirection
  }

  queryParams.page = 0
  currentDisplayPage.value = 1

  router.push({ query: {} })
}

const changeProductDataPage = (newDisplayPage: number) => {
  queryParams.page = newDisplayPage - 1
  currentDisplayPage.value = newDisplayPage
}

const NavigateToProductDetail = (productUuid: string) => {
  router.push({ name: 'product-detail', params: { productUuid } })
}

const addItemToCart = async (productUuid: string) => {
  if (!isAuthenticated.value) {
    router.push({ name: 'login' })
    return
  }

  try {
    await addCartItem({ productUuid, quantity: 1 })
    showSuccess('Add to cart successfully!')
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  }
}

watch(queryParams, fetchProductData, { deep: true, immediate: true })
</script>

<template>
  <v-layout width="70%" max-width="75rem" class="d-flex flex-column pt-8 ga-10">
    <search-bar v-model="searchTerm" :loading="isLoading" @submit="SearchProductData" />
    <filter-dropdowns v-model="queryOptions" @option-changed="SelectProductData" />
    <!-- Result -->
    <v-container class="d-flex flex-column ga-7">
      <!-- Result Title -->
      <div class="text-body-1 text-primary">
        <span class="font-weight-medium">{{ totalProductData }}</span> results found
      </div>
      <!-- Product List -->
      <v-container>
        <v-row>
          <!-- Loader -->
          <div v-if="isLoading" class="w-100">
            <v-row>
              <v-col v-for="n in count" :key="n">
                <v-skeleton-loader type="card" height="300" />
              </v-col>
            </v-row>
          </div>
          <!-- Result :  Success but not found -->
          <div
            v-else-if="productData.length === 0"
            class="w-100 d-flex flex-column justify-center align-center ga-1"
            style="min-height: 15rem"
          >
            <v-icon icon="mdi-alert-circle-outline" size="x-large" color="secondary" />
            <div class="text-subtitle-2 text-secondary">No productData found</div>
          </div>
          <!-- Result : Success -->
          <v-row v-else>
            <v-col
              v-for="product in productData"
              :key="product.uuid"
              :cols="12"
              :sm="6"
              :md="4"
              :lg="3"
            >
              <!-- Card -->
              <product-card
                :product="product"
                @navigate="NavigateToProductDetail(product.uuid)"
                @add-to-cart="addItemToCart"
              />
            </v-col>
          </v-row>
        </v-row>
      </v-container>
      <!-- Pagination -->
      <v-pagination
        v-if="totalPages > 1"
        rounded="circle"
        color="accent"
        active-color="success"
        total-visible="6"
        :length="totalPages"
        :loading="isLoading"
        :disabled="isLoading"
        v-model="currentDisplayPage"
        @update:model-value="changeProductDataPage"
      />
    </v-container>
  </v-layout>
</template>

<style scoped></style>
