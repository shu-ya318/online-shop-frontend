<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useNotificationStore } from '@/stores/notificationStore'

import { getUserOrderByUuid } from '@/api/order'

import type { OrderResponse } from '@/api/order/interface'

const { showError } = useNotificationStore()

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const orderDetail = ref<OrderResponse | null>(null)

const orderDetailInfo = computed(() => {
  if (!orderDetail.value) return {}

  const { orderUuid, status, subtotal, shipping, total, totalQuantity } = orderDetail.value

  return {
    'Order UUID': orderUuid,
    Status: status.toLowerCase(),
    Subtotal: `$${subtotal}`,
    Shipping: `$${shipping}`,
    Total: `$${total}`,
    'Total Quantity': totalQuantity,
  }
})

const fetchUserOrderDetail = async (values: string) => {
  if (!values) {
    showError('Order uuid is missing')
    return
  }

  try {
    const response = await getUserOrderByUuid(values)
    orderDetail.value = response
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  } finally {
    isLoading.value = false
  }
}

const onNavigateToProducts = () => {
  router.push({ name: 'products' })
}

onMounted(() => {
  fetchUserOrderDetail(route.params.orderUuid as string)
})
</script>

<template>
  <!-- Loader -->
  <v-container v-if="isLoading" class="d-flex mt-10 justify-center">
    <v-skeleton-loader type="card" height="280" width="65%"></v-skeleton-loader>
  </v-container>
  <!-- Result : Success but Not found -->
  <div
    v-else-if="!orderDetail"
    class="w-100 d-flex flex-column justify-center align-center ga-1"
    style="min-height: 20rem"
  >
    <v-icon icon="mdi-alert-circle-outline" size="x-large" color="secondary" />
    <div class="text-subtitle-2 text-secondary">No order found</div>
  </div>
  <!-- Result : Success -->
  <v-container v-else class="w-100 d-flex flex-column align-center ga-4">
    <!-- Icon -->
    <v-icon icon="mdi-check-circle" size="56" color="success" class="mt-15" />
    <!-- Title -->
    <div class="text-h5 text-primary font-weight-bold text-center">Thanks for your order!</div>
    <!-- Action buttons -->
    <v-btn variant="tonal" color="accent" class="px-3 text-subtitle-2" @click="onNavigateToProducts"
      >Continue shopping</v-btn
    >
    <!-- Order summary -->
    <div class="d-flex flex-column ga-4 border-sm rounded-lg mt-4 px-8 py-4">
      <!-- Subtitle -->
      <div class="text-h6 text-primary mb-2">Order Summary</div>
      <!-- Info -->
      <!-- <div class="text-body-2 text-secondary ga-2"> -->
      <div
        v-for="(value, key) in orderDetailInfo"
        :key="key"
        class="text-body-1 text-primary d-flex align-center ga-2"
      >
        {{ key }}:
        <template v-if="key === 'Status'">
          <v-chip size="small" color="warning">{{ value }}</v-chip>
        </template>
        <template v-else>
          <span class="text-secondary ml-2">{{ value }}</span>
        </template>
      </div>
    </div>
    <!-- </div> -->
  </v-container>
</template>

<style scoped></style>
