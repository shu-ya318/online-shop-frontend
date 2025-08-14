<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const router = useRouter()

const errorMessage = computed(() => {
  return route.query.message || 'Please try again later.'
})

const navigateToHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <v-card width="100%" max-width="32.5rem">
    <v-container class="d-flex flex-column ga-5" style="padding: 1.5rem 2.25rem;">
      <v-card-title>Oops! Error has occurred</v-card-title>
      <v-card-text>{{ errorMessage }}</v-card-text>
      <v-card-actions>
        <v-btn color="success" :block="true" @click="navigateToHome">
          Back to home
        </v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<style scoped></style>
