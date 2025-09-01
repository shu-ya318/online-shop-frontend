<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'

import { useNotification } from '@/composables/useNotification'
import { useResponsiveCount } from '@/composables/useResponsiveCount'

import SearchBar from '@/components/dashboard/product/SearchBar.vue'
import FilterDropdowns from '@/components/dashboard/product/FilterDropdowns.vue'
import ProductCard from '@/components/dashboard/product/ProductCard.vue'

import { getProducts } from '@/api/product'

import type { ProductDetailResponse } from '@/api/product/interface'

export interface Filter {
  type: 'sort' | 'filter'
  model: string | null
  placeholder: string
  items: string[] | { title: string; value: string }[]
}

interface QueryParams {
  size: number
  sort: string
  filter: string
  page: number
}

const { showSnackbar, snackbarColor, resultMessage, showError } = useNotification()

const { count } = useResponsiveCount()

const router = useRouter()

const searchTerm = ref('')

const filterItems = ref<Filter[]>([
  {
    type: 'filter',
    model: null,
    placeholder: 'Select Category',
    items: ['vegetables', 'fruits', 'protein', 'grains'],
  },
  {
    type: 'sort',
    model: null,
    placeholder: 'Sort by: Sold',
    items: [
      { title: 'Most Sold', value: 'totalSold,desc' },
      { title: 'Least Sold', value: 'totalSold,asc' },
    ],
  },
  {
    type: 'sort',
    model: null,
    placeholder: 'Sort by: Date',
    items: [
      { title: 'Latest', value: 'createdAt,desc' },
      { title: 'Oldest', value: 'createdAt,asc' },
    ],
  },
])

const isLoading = ref(true)
const products = ref<ProductDetailResponse[] | null>(null)
const perPage = ref(16)
const totalPages = ref(0)
const totalProducts = ref(0)

const queryParams = reactive<QueryParams>({
  page: 0,
  size: perPage.value,
  sort: '',
  filter: '',
})

const pagination = computed({
  get: () => queryParams.page + 1,
  set: (value) => {
    queryParams.page = value - 1
  },
})

const computedSortQuery = computed(() => {
  return filterItems.value
    .filter((filter) => filter.type === 'sort' && filter.model)
    .map((filter) => String(filter.model))
    .join(',')
})

const computedFilterQuery = computed(() => {
  const params: string[] = []

  const categoryFilter = filterItems.value.find(
    (filter) => filter.type === 'filter' && filter.model,
  )
  if (categoryFilter) {
    params.push(`category:${categoryFilter.model}`)
  }

  if (searchTerm.value) {
    params.push(`name:${searchTerm.value}`)
  }

  return params.join(',')
})

const fetchProducts = async (params: QueryParams) => {
  try {
    const response = await getProducts(params)
    products.value = response.content
    totalProducts.value = response.totalElements
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

onMounted(() => {
  fetchProducts(queryParams)
})

const applyFiltersAndSearch = () => {
  queryParams.sort = computedSortQuery.value
  queryParams.filter = computedFilterQuery.value
  queryParams.page = 0

  fetchProducts(queryParams)
}

const handleProductsSearch = debounce(() => {
  if (!searchTerm.value || searchTerm.value.trim() === '') {
    showError('Please enter a search term')
    return
  }

  applyFiltersAndSearch()
}, 500)

const filterProducts = () => {
  applyFiltersAndSearch()
}

const changeProducts = (newPage: number) => {
  queryParams.page = newPage
  fetchProducts({ ...queryParams, page: newPage })
}

const NavigateToProductDetail = (productUuid: string) => {
  router.push({ name: 'product-detail', params: { productUuid } })
}
</script>

<template>
  <v-layout width="70%" max-width="75rem" class="d-flex flex-column pt-8 ga-10">
    <search-bar v-model="searchTerm" :loading="isLoading" @submit="handleProductsSearch" />
    <filter-dropdowns v-model="filterItems" @update:model-value="filterProducts" />
    <!-- Result -->
    <v-container class="d-flex flex-column ga-7">
      <!-- Result Title -->
      <div class="text-body-1 text-primary">
        <span class="font-weight-medium">{{ totalProducts }}</span> results found
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
          <div v-else-if="products && products.length === 0"
            class="w-100 d-flex flex-column justify-center align-center ga-1" style="min-height: 15rem">
            <v-icon icon="mdi-alert-circle-outline" size="x-large" color="secondary" />
            <div class="text-subtitle-2 text-secondary">No products found</div>
          </div>
          <!-- Result : Success -->
          <v-row v-else>
            <v-col v-for="product in products" :key="product.uuid" :cols="12" :sm="6" :md="4" :lg="3">
              <!-- Card -->
              <product-card :product="product" :discount-price="product.discountedPrice"
                @navigate="NavigateToProductDetail(product.uuid)" />
            </v-col>
          </v-row>
        </v-row>
      </v-container>
      <!-- Pagination -->
      <v-pagination v-if="totalPages > 1" rounded="circle" color="accent" active-color="success" total-visible="6"
        :length="totalPages" v-model="pagination" @update:model-value="changeProducts" />
    </v-container>
    <!-- Snackbar -->
    <v-snackbar timeout="3000" location="top" :color="snackbarColor" v-model="showSnackbar">
      {{ resultMessage }}
    </v-snackbar>
  </v-layout>
</template>

<style scoped></style>
