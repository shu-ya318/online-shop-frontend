<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const errorCode = computed(() => route.params.code)
const errorMessage = computed(() => {
  const code = String(errorCode.value)

  switch (code) {
    case '400':
      return 'Bad request. Please check your input and try again.'
    case '401':
      return 'Authentication required. Please login and try again.'
    case '403':
      return 'Sorry, you are not authorized to access this page.'
    case '404':
      return 'Sorry, the page you are looking for does not exist.'
    case '408':
      return 'Request timeout. Please try again later.'
    case '500':
      return 'Sorry, something went wrong. Please try again later.'
    case 'network':
      return 'Network connection failed. Please check your connection and try again.'
    default:
      return 'An unexpected error has occurred. Please try again later.'
  }
})
</script>

<template>
  <v-card width="100%" max-width="32.5rem">
    <v-container class="d-flex flex-column ga-5" style="padding: 1.5rem 2.25rem;">
      <v-card-title>Oops! Error has occurred</v-card-title>
      <v-card-text>{{ errorMessage }}</v-card-text>
      <v-card-actions>
        <v-btn color="success" :block="true" @click="router.push({ name: 'home' })">
          Back to home
        </v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<style scoped></style>
