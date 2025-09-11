<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/userStore'
import { useCartStore } from '@/stores/cartStore'
import { useNotification } from '@/composables/useNotification'
import { useResponsiveCount } from '@/composables/useResponsiveCount'

import HomeBanner from '@/components/dashboard/home/HomeBanner.vue'
import BestSellerSection from '@/components/dashboard/home/BestSellerSection.vue'
import CategoriesSection from '@/components/dashboard/home/CategoriesSection.vue'

import { getProducts } from '@/api/product'

import { SortDirection, Category } from '@/types/common'

import type { ProductDetailResponse } from '@/api/product/interface'

import vegetablesImage from '@/assets/images/vegetables.png'
import fruitsImage from '@/assets/images/fruits.png'
import proteinImage from '@/assets/images/protein.png'
import grainsImage from '@/assets/images/grains.png'

const router = useRouter()

const route = useRoute()

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore);
const { exchangeOAuth2Code } = userStore

const { addCartItem } = useCartStore()

const { showSnackbar, snackbarColor, resultMessage, showError, showSuccess } = useNotification()

const { count } = useResponsiveCount()

const categories = [
  {
    name: 'Vegetables',
    value: Category.VEGETABLES,
    image: vegetablesImage,
  },
  {
    name: 'Fruits',
    value: Category.FRUITS,
    image: fruitsImage,
  },
  {
    name: 'Protein',
    value: Category.PROTEIN,
    image: proteinImage,
  },
  {
    name: 'Grains',
    value: Category.GRAINS,
    image: grainsImage,
  },
]

const isOAuth2CodeLoading = ref(false)

const isBestSellersLoading = ref(true)
const isError = ref(false)
const bestSellers = ref<ProductDetailResponse[] | null>(null)
const pageSize = ref(12)
const totalPages = ref(0)

const groupedBestSellers = computed(() => {
  const chunkSize = 3
  const itemsToGroup = bestSellers.value

  return Array.from(
    { length: Math.ceil((itemsToGroup?.length ?? 0) / chunkSize) },
    (_, index) => itemsToGroup?.slice(index * chunkSize, index * chunkSize + chunkSize) ?? [],
  )
})

const fetchBestSellers = async () => {
  isError.value = false

  try {
    const response = await getProducts({
      page: 0,
      size: pageSize.value,
      sortBy: 'totalSold',
      sortDirection: SortDirection.DESC,
      filter: {},
    })
    bestSellers.value = response.content
    totalPages.value = response.totalElements
  } catch (error) {
    isError.value = true
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  } finally {
    isBestSellersLoading.value = false
  }
}

onMounted(() => {
  fetchBestSellers()
})

onMounted(async () => {
  const oauth2Code = route.query.oauth2Code

  if (oauth2Code && typeof oauth2Code === 'string') {
    isOAuth2CodeLoading.value = true

    try {
      await exchangeOAuth2Code(oauth2Code)
      showSuccess('Login success!')
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 500)
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError(String(error))
      }
    } finally {
      const query = { ...route.query }
      delete query.oauth2Code
      router.replace({ query })

      isOAuth2CodeLoading.value = false
    }
  }
})

const NavigateToProducts = () => {
  router.push({ name: 'products' })
}

const NavigateToProductsWithCategory = (category: Category) => {
  router.push({ name: 'products', query: { category } })
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
</script>

<template>
  <v-layout class="d-flex flex-column">
    <!-- Home Banner -->
    <home-banner @navigate="NavigateToProducts" />
    <v-container width="70%" max-width="75rem"
      class="d-flex flex-column justify-space-between align-center mt-16 mb-16 pa-0" style="gap: 5rem">
      <!-- Best Sellers -->
      <best-seller-section :skeletons-count="count" :is-loading="isBestSellersLoading" :groups="groupedBestSellers"
        :is-error="isError" @add-to-cart="addItemToCart" />
      <!-- Categories -->
      <categories-section :items="categories" @navigate="NavigateToProductsWithCategory" />
    </v-container>
    <!-- Snackbar -->
    <v-snackbar timeout="3000" location="top" :color="snackbarColor" v-model="showSnackbar">
      {{ resultMessage }}
    </v-snackbar>
  </v-layout>
</template>

<style scoped></style>
