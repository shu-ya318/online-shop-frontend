<script setup lang="ts">
import type { ProductDetailResponse } from '@/api/product/interface'

withDefaults(
  defineProps<{
    product?: ProductDetailResponse | null
    isError?: boolean
    discountPrice: number
  }>(),
  {
    product: null,
  }
)

defineEmits<{
  (event: 'add-to-cart', uuid: string): void
  (event: 'navigate'): void
}>()
</script>

<template>
  <v-card rounded="lg" class="d-flex flex-column justify-space-between border-sm border-success pa-2"
    @click="$emit('navigate')">
    <!-- Image -->
    <v-img width="300" height="300" contain :src="product?.imageUrl">
      <template #error>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-icon icon="mdi-image-remove-outline" size="x-large" color="grey-lighten-1" />
        </v-row>
      </template>
    </v-img>
    <!-- Info -->
    <div class="d-flex flex-column px-4 ga-0">
      <div class="text-subtitle-1 text-secondary text-truncate">{{ product?.name ?? '--' }}</div>
      <div class="text-h6 text-primary font-weight-bold">
        ${{ discountPrice ?? '--'
        }}<span class="ml-2 text-info text-decoration-line-through">${{ product?.price ?? '--' }}</span>
      </div>
      <div class="text-subtitle-2 text-secondary">{{ product?.totalSold ?? 0 }}+ sold</div>
    </div>
    <v-btn icon="mdi-cart-outline" size="small" variant="flat" color="success" class="mx-4 my-2" :disabled="isError"
      @click.stop="$emit('add-to-cart', product?.uuid ?? '')" />
  </v-card>
</template>

<style scoped></style>
