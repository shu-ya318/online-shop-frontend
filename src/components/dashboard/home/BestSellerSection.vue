<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/userStore'
import { useCartStore } from '@/stores/cartStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useResponsiveCount } from '@/composables/useResponsiveCount'
import { hasDiscount } from '@/utils/hasDiscount'

import { getProducts } from '@/api/product'

import { AvailabilityStatus, SortBy, SortDirection } from '@/types/enum'
import type { ProductResponse } from '@/api/product/interface'

const router = useRouter()

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)

const { addUserCartItem, isLoading: isAddingToCart } = useCartStore()

const { showError, showSuccess } = useNotificationStore()

const { count } = useResponsiveCount()

const isLoading = ref(true)
const isError = ref(false)
const bestSellerData = ref<ProductResponse[]>([])
const pageSize = ref(12)
const totalPages = ref(0)

const groupedBestSellerData = computed(() => {
  const chunkSize = 3
  const itemsToGroup = bestSellerData.value

  if (!itemsToGroup) return []

  return Array.from({ length: Math.ceil(itemsToGroup.length / chunkSize) }, (_, index) =>
    itemsToGroup.slice(index * chunkSize, index * chunkSize + chunkSize),
  )
})

const getBestSellerData = async () => {
  isError.value = false

  try {
    const response = await getProducts({
      page: 0,
      size: pageSize.value,
      sortBy: SortBy.TOTAL_SOLD,
      sortDirection: SortDirection.DESC,
    })
    bestSellerData.value = response.content
    totalPages.value = response.totalElements
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

const addItemToCart = async (productUuid: string) => {
  if (!isAuthenticated.value) {
    router.push({ name: 'login' })
    return
  }

  try {
    await addUserCartItem({ productUuid, quantity: 1 })
    showSuccess('Add to cart successfully!')
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  }
}

onMounted(() => {
  getBestSellerData()
})
</script>

<template>
  <v-container class="pa-0">
    <!-- Title -->
    <div class="underline-title mb-5 text-h5 text-primary font-weight-bold text-center">
      Best Seller
    </div>
    <div class="mb-2 text-subtitle-1 text-accent text-center">Top 12</div>
    <!-- Loader -->
    <div v-if="isLoading" class="w-100">
      <v-row>
        <v-col v-for="n in count" :key="n">
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
      <div class="text-body-2 text-error">Get best seller products failed</div>
    </div>
    <!-- Result : Success but not found -->
    <div
      v-else-if="!groupedBestSellerData || groupedBestSellerData.length === 0"
      class="w-100 d-flex flex-column justify-center align-center ga-1 border-md border-accent rounded-lg"
      style="min-height: 6rem"
    >
      <v-icon icon="mdi-alert-circle-outline" size="x-large" color="info" />
      <div class="text-body-2 text-info">No best seller products found</div>
    </div>
    <!-- Result: Success -->
    <v-carousel v-else hide-delimiters color="success" height="auto" cycle :show-arrows="false">
      <!-- Carousel Items -->
      <v-carousel-item v-for="group in groupedBestSellerData" :key="group[0].uuid">
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
                    <template v-if="hasDiscount(item)">
                      ${{ Math.round(item.discountPrice) ?? '--' }}
                      <span class="ml-2 text-info text-decoration-line-through">
                        ${{ Math.round(item.price) ?? '--' }}
                      </span>
                    </template>
                    <template v-else> ${{ Math.round(item.price) ?? '--' }} </template>
                  </div>
                </div>
                <div class="text-body-2 text-secondary">{{ item.totalSold ?? 0 }}+ sold</div>
              </div>
              <v-btn
                icon="mdi-cart-outline"
                variant="text"
                color="accent"
                :loading="isAddingToCart"
                :disabled="
                  !item.uuid ||
                  item.availabilityStatus === AvailabilityStatus.OUT_OF_STOCK ||
                  isAddingToCart
                "
                @click.stop="addItemToCart(item.uuid)"
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
