<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

import { getUserOrders } from '@/api/order'

import { useNotificationStore } from '@/stores/notificationStore'

import type { OrderResponse, PaginatedOrderRequest } from '@/api/order/interface'

enum Align {
  START = 'start',
  END = 'end',
  CENTER = 'center',
}

const headerData = [
  { title: 'Order UUID', key: 'orderUuid', align: Align.START },
  {
    title: 'Total Amount',
    key: 'total',
    align: Align.START,
    value: (order: OrderResponse) => `$ ${order.total}`,
  },
  { title: 'Total Quantity', key: 'totalQuantity', align: Align.START },
  { title: 'Status', key: 'status', align: Align.START },
]
console.log('headerData', headerData)
const { showError } = useNotificationStore()

const isLoading = ref(true)
const queryParams = reactive<PaginatedOrderRequest>({
  page: 0,
  size: 10,
})
const orderData = ref<OrderResponse[]>([])
const totalPages = ref(0)
const totalOrderData = ref(0)

const fetchOrders = async () => {
  isLoading.value = true

  try {
    const response = await getUserOrders(queryParams)
    orderData.value = response.content
    totalOrderData.value = response.totalElements
    totalPages.value = response.totalPages
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

const onUpdateOptions = ({ page, itemsPerPage }: { page: number; itemsPerPage: number }) => {
  queryParams.page = page - 1
  queryParams.size = itemsPerPage === -1 ? totalOrderData.value : itemsPerPage
}

watch(queryParams, fetchOrders, { deep: true, immediate: true })
</script>

<template>
  <!-- Loader -->
  <v-data-table-server
    class="w-100"
    style="max-width: 75rem"
    item-value="orderUuid"
    :headers="headerData"
    :items-length="totalOrderData"
    :loading="isLoading"
    :items="orderData"
    :items-per-page-options="[10, 25, 50, 100]"
    @update:options="onUpdateOptions"
  >
  </v-data-table-server>
</template>

<style scoped></style>
