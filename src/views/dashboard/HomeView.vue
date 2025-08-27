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

const isLoading = ref(true)
const isError = ref(false)
const bestSellers = ref<ProductDetailResponse[] | null>(null)
const perPage = ref(12)
const total = ref(0)

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
    // const response = await getProducts({
    //   page: 0,
    //   size: perPage.value,
    //   sort: 'totalSold,desc',
    //   filter: '',
    // })
    // const { content, totalElements } = response
    // bestSellers.value = content
    // total.value = totalElements
    console.log('待完成fetchBestSellers')
  } catch (error) {
    isError.value = true
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
    <!-- Home Banner -->
    <home-banner @navigate="NavigateToProducts" />
    <v-container
      width="70%"
      max-width="75rem"
      class="d-flex flex-column justify-space-between align-center mt-16 mb-16 pa-0"
      style="gap: 5rem"
    >
      <!-- Best Sellers -->
      <best-seller-section
        :skeletons-count="count"
        :is-loading="isLoading"
        :groups="groupedBestSellers"
        :is-error="isError"
        @add-to-cart="AddToCart"
      />
      <!-- Categories -->
      <categories-section :items="categories" @navigate="NavigateToCategory" />
    </v-container>
    <!-- Snackbar -->
    <v-snackbar timeout="3000" location="top" :color="snackbarColor" v-model="showSnackbar">
      {{ resultMessage }}
    </v-snackbar>
  </v-layout>
</template>

<style scoped></style>
