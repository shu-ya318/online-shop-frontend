<script setup lang="ts">
import type { ProductDetailResponse } from '@/api/product/interface'

withDefaults(
  defineProps<{
    groups?: ProductDetailResponse[][] | null
    isLoading?: boolean
    skeletonsCount?: number
    isError?: boolean
  }>(),
  {
    groups: null,
    skeletonsCount: 0,
  }
)

defineEmits<{
  (event: 'add-to-cart', uuid: string): void
}>()
</script>

<template>
  <v-container class="pa-0">
    <!-- Title -->
    <div class="underline-title mb-5 text-h5 text-primary font-weight-bold text-center">
      Best Seller
    </div>
    <div class="mb-2 text-subtitle-1 text-accent text-center">Top 12</div>
    <!-- Loader -->
    <div v-if="isLoading">
      <v-row>
        <v-col v-for="n in skeletonsCount" :key="n">
          <v-skeleton-loader type="card" />
        </v-col>
      </v-row>
    </div>
    <!-- Result : Error -->
    <div
      v-else-if="isError"
      class="w-100 d-flex flex-column justify-center align-center ga-1 border-md border-error rounded-lg"
      style="min-height: 6rem"
    >
      <v-icon icon="mdi-alert-circle-outline" size="x-large" color="error" />
      <div class="text-body-2 text-error">Fetch best seller products failed</div>
    </div>
    <!-- Result : Success but not found -->
    <div
      v-else-if="!groups?.length"
      class="w-100 d-flex flex-column justify-center align-center ga-1 border-md border-accent rounded-lg"
      style="min-height: 6rem"
    >
      <v-icon icon="mdi-alert-circle-outline" size="x-large" color="info" />
      <div class="text-body-2 text-info">No best seller products found</div>
    </div>
    <!-- Result : Success -->
    <v-carousel v-else hide-delimiters color="success" height="auto" cycle :show-arrows="false">
      <!-- Carousel Items -->
      <v-carousel-item v-for="(group, index) in groups" :key="index">
        <v-row>
          <v-col v-for="item in group" :key="item.uuid" cols="12" md="4">
            <v-card
              flat
              class="d-flex align-center justify-space-between fill-height pa-2 border-md border-success"
            >
              <div class="d-flex align-center ga-4">
                <v-img
                  width="3.5rem"
                  height="3.5rem"
                  contain
                  style="flex: none"
                  :src="item.imageUrl"
                >
                  <template #error>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-icon
                        icon="mdi-image-remove-outline"
                        size="x-large"
                        color="grey-lighten-1"
                      />
                    </v-row>
                  </template>
                </v-img>
                <div class="d-flex flex-column ga-0">
                  <div class="text-subtitle-1 text-accent text-truncate">
                    {{ item.name ?? '--' }}
                  </div>
                  <div class="text-h6 text-primary font-weight-bold">
                    ${{ item.discountedPrice ?? '--' }}
                    <span class="text-info line-through">${{ item.price ?? '--' }}</span>
                  </div>
                </div>
                <div class="text-body-2 text-secondary">{{ item.totalSold ?? 0 }}+ sold</div>
              </div>
              <v-btn
                icon="mdi-cart-outline"
                variant="text"
                color="accent"
                :disabled="isError"
                @click="$emit('add-to-cart', item?.uuid)"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<style scoped>
.underline-title {
  text-decoration: underline;
  text-decoration-color: rgb(var(--v-theme-success));
  text-underline-offset: 0.8rem;
}
</style>
