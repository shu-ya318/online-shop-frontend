<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import debounce from 'lodash/debounce'

import { useNotification } from '@/composables/useNotification'
import { useResponsiveCount } from '@/composables/useResponsiveCount'

import SearchBar from '@/components/dashboard/product/SearchBar.vue'
import FilterDropdowns from '@/components/dashboard/product/FilterDropdowns.vue'
import ProductCard from '@/components/dashboard/product/ProductCard.vue'

import { getProducts } from '@/api/product'

import type { ProductDetailResponse, ProductsRequest } from '@/api/product/interface'
import type { SortString } from '@/types/common'

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

const { showSnackbar, snackbarColor, resultMessage, showError } = useNotification()

const { count } = useResponsiveCount()

const router = useRouter()

const route = useRoute()

const searchTerm = ref('')
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
      { title: 'Latest', value: 'createdAt,desc' },
      { title: 'Oldest', value: 'createdAt,asc' },
    ],
  },
])
const perPage = ref(2) //16

const queryParams = reactive<ProductsRequest>({
  page: 0,
  size: perPage.value,
  sort: '',
  name: '',
  category: '',
  // filter: '',
})

const currentDisplayPage = ref(1)

const isLoading = ref(true)
const products = ref<ProductDetailResponse[] | null>(null)
const totalPages = ref(0)
const totalProducts = ref(0)

const computedSortQuery = computed((): SortString | '' => {
  const sortOptions = queryOptions.value
    .filter((filter) => filter.type === 'sort' && filter.model)
    .map((filter) => String(filter.model))

  return sortOptions.length > 0 ? (sortOptions[0] as SortString) : ''
})

const fetchProducts = async (params: ProductsRequest) => {
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

const initializeFromRouteQuery = () => {
  const { category, sort, name } = route.query

  if (category && typeof category === 'string') {
    const categoryFilter = queryOptions.value.find(
      (option) => option.type === QueryOptionType.FILTER && option.placeholder === 'Select Category'
    )
    if (categoryFilter) {
      categoryFilter.model = category
      queryParams.category = category
    }
  }

  if (sort && typeof sort === 'string') {
    const sortFilter = queryOptions.value.find(
      (option) => option.type === QueryOptionType.SORT &&
      Array.isArray(option.items) &&
      option.items.some((item) => typeof item === 'object' && item.value === sort)
    )
    if (sortFilter) {
      sortFilter.model = sort
      queryParams.sort = sort as SortString
    }
  }

  if (name && typeof name === 'string') {
    searchTerm.value = name
    queryParams.name = name
  }
}

onMounted(() => {
  initializeFromRouteQuery()
  fetchProducts(queryParams)
})

watch(
  () => route.query,
  () => {
    queryParams.page = 0
    currentDisplayPage.value = 1

    initializeFromRouteQuery()
    fetchProducts(queryParams)
  },
  { deep: true }
)

const applyFiltersAndSearch = () => {
  queryParams.sort = computedSortQuery.value

  const categoryFilter = queryOptions.value.find(
    (filter) => filter.type === 'filter' && filter.model,
  )
  queryParams.category = categoryFilter?.model as string || ''
  queryParams.name = searchTerm.value

  queryParams.page = 0
  currentDisplayPage.value = 1

  fetchProducts(queryParams)
}

const SearchProducts = debounce(() => {
  if (!searchTerm.value || searchTerm.value.trim() === '') {
    showError('Please enter a search term')
    return
  }

  applyFiltersAndSearch()
}, 500)

const filterProducts = () => {
  applyFiltersAndSearch()
}

const changeProductsPage = (newDisplayPage: number) => {
  queryParams.page = newDisplayPage - 1
  currentDisplayPage.value = newDisplayPage

  fetchProducts({ ...queryParams, page: newDisplayPage - 1 })
}

const NavigateToProductDetail = (productUuid: string) => {
  router.push({ name: 'product-detail', params: { productUuid } })
}
</script>

<template>
  <v-layout width="70%" max-width="75rem" class="d-flex flex-column pt-8 ga-10">
    <search-bar v-model="searchTerm" :loading="isLoading" @submit="SearchProducts" />
    <filter-dropdowns v-model="queryOptions" @update:model-value="filterProducts" />
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
          <div
            v-else-if="products && products.length === 0"
            class="w-100 d-flex flex-column justify-center align-center ga-1"
            style="min-height: 15rem"
          >
            <v-icon icon="mdi-alert-circle-outline" size="x-large" color="secondary" />
            <div class="text-subtitle-2 text-secondary">No products found</div>
          </div>
          <!-- Result : Success -->
          <v-row v-else>
            <v-col
              v-for="product in products"
              :key="product.uuid"
              :cols="12"
              :sm="6"
              :md="4"
              :lg="3"
            >
              <!-- Card -->
              <product-card :product="product" @navigate="NavigateToProductDetail(product.uuid)" />
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
        v-model="currentDisplayPage"
        @update:model-value="changeProductsPage"
      />
    </v-container>
    <!-- Snackbar -->
    <v-snackbar timeout="3000" location="top" :color="snackbarColor" v-model="showSnackbar">
      {{ resultMessage }}
    </v-snackbar>
  </v-layout>
</template>

<style scoped></style>
