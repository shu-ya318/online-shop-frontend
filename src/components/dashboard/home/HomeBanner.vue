<script setup lang="ts">
import { useRouter } from 'vue-router'

import bannerImage from '@/assets/images/banner.png'

const router = useRouter()

const NavigateToProducts = () => {
  router.push({ name: 'products' })
}
</script>

<template>
  <v-container
    width="72%"
    max-width="75rem"
    class="d-flex justify-space-between align-center mt-16 pr-0"
    style="background-color: #edf2ee"
  >
    <!-- Solgan -->
    <v-container width="40%" class="d-flex flex-column ga-10">
      <div class="text-h3 text-primary font-weight-bold">Fresh Food</div>
      <div class="text-subtitle-1 text-primary">
        Sale up to <span class="text-warning">30% OFF</span>
      </div>
      <v-btn
        width="10rem"
        append-icon="mdi-arrow-right"
        color="success"
        class="text-subtitle-2"
        @click="NavigateToProducts"
      >
        Shop now
      </v-btn>
    </v-container>
    <!-- Image -->
    <v-img width="50%" height="100%" contain :src="bannerImage">
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
        </div>
      </template>
    </v-img>
  </v-container>
</template>
