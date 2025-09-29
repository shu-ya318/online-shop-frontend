<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useUserStore } from '@/stores/userStore'
import { useNotificationStore } from '@/stores/notificationStore'

import HomeBanner from '@/components/dashboard/home/HomeBanner.vue'
import BestSellerSection from '@/components/dashboard/home/BestSellerSection.vue'
import CategoriesSection from '@/components/dashboard/home/CategoriesSection.vue'

const router = useRouter()
const route = useRoute()

const { exchangeOAuth2Code } = useUserStore()

const { showError, showSuccess } = useNotificationStore()

const isLoading = ref(false)

onMounted(async () => {
  const oauth2Code = route.query.oauth2Code

  if (oauth2Code && typeof oauth2Code === 'string') {
    isLoading.value = true

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

      isLoading.value = false
    }
  }
})
</script>

<template>
  <v-layout class="d-flex flex-column">
    <!-- Home Banner -->
    <home-banner />
    <v-container
      width="70%"
      max-width="75rem"
      class="d-flex flex-column justify-space-between align-center mt-16 mb-16 pa-0"
      style="gap: 5rem"
    >
      <!-- Best Sellers -->
      <best-seller-section />
      <!-- Categories -->
      <categories-section />
    </v-container>
  </v-layout>
</template>

<style scoped></style>
