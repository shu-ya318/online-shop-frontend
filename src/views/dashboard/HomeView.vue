<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useNotification } from '@/composables/useNotification'
import { useResponsiveCount } from '@/composables/useResponsiveCount'

import HomeBanner from '@/components/dashboard/home/HomeBanner.vue'
import BestSellerSection from '@/components/dashboard/home/BestSellerSection.vue'
import CategoriesSection from '@/components/dashboard/home/CategoriesSection.vue'

import { getProducts } from '@/api/product/index'

import type { ProductDetailResponse } from '@/api/product/interface'

import vegetablesImage from '@/assets/images/vegetables.png'
import fruitsImage from '@/assets/images/fruits.png'
import proteinImage from '@/assets/images/protein.png'
import grainsImage from '@/assets/images/grains.png'

const router = useRouter()

const { showSnackbar, snackbarColor, resultMessage, showError } = useNotification()

const { count } = useResponsiveCount()

const categories = [
  {
    name: 'Vegetables',
    image: vegetablesImage,
  },
  {
    name: 'Fruits',
    image: fruitsImage,
  },
  {
    name: 'Protein',
    image: proteinImage,
  },
  {
    name: 'Grains',
    image: grainsImage,
  },
]

const isBestSellersLoading = ref(false)
const isBestSellersError = ref(false)
const bestSellers = ref<ProductDetailResponse[] | null>(null)
const bestSellersPerPage = ref(12)
const totalBestSellers = ref(0)

const groupedBestSellers = computed(() => {
  const chunkSize = 3
  const itemsToGroup = bestSellers.value

  return Array.from(
    { length: Math.ceil((itemsToGroup?.length ?? 0) / chunkSize) },
    (_, index) => itemsToGroup?.slice(index * chunkSize, index * chunkSize + chunkSize) ?? [],
  )
})

const fetchBestSellers = async () => {
  isBestSellersLoading.value = true
  isBestSellersError.value = false

  try {
    const response = await getProducts({
      page: 0,
      size: bestSellersPerPage.value,
      sort: 'totalSold,desc',
      filter: '',
    })
    bestSellers.value = response.content
    totalBestSellers.value = response.totalElements
  } catch (error) {
    isBestSellersError.value = true
    showError(error as string)
  } finally {
    isBestSellersLoading.value = false
  }
}

onMounted(() => {
  fetchBestSellers()
})

const NavigateToProducts = () => {
  router.push({ name: 'products' })
}

const NavigateToCategory = (category: string) => {
  router.push({ name: 'products', query: { category } })
}

// TODO: Add to cart
const AddToCart = (uuid: string) => {
  console.log('add to cart:', uuid)
}
</script>

<template>
  <v-layout class="d-flex flex-column">
    <home-banner @navigate="NavigateToProducts" />
    <v-container width="70%" max-width="75rem"
      class="d-flex flex-column justify-space-between align-center mt-16 mb-16 pa-0" style="gap: 5rem">
      <best-seller-section :skeletons-count="count" :is-loading="isBestSellersLoading" :groups="groupedBestSellers"
        :is-error="isBestSellersError" @add-to-cart="AddToCart" />
      <categories-section :items="categories" @navigate="NavigateToCategory" />
    </v-container>
    <!-- Snackbar -->
    <v-snackbar timeout="3000" location="top" :color="snackbarColor" v-model="showSnackbar">
      {{ resultMessage }}
    </v-snackbar>
  </v-layout>
</template>

<style scoped></style>
