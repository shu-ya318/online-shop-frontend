<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

import { getUserOrders } from '@/api/order'

import { useNotificationStore } from '@/stores/notificationStore'

import { OrderStatus } from '@/types/enum'
import type { PaginatedRequest } from '@/api/common/interface'
import type { OrderResponse } from '@/api/order/interface'

enum Align {
  START = 'start',
  END = 'end',
  CENTER = 'center',
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return 'success'
    case OrderStatus.CANCELLED:
      return 'error'
    default:
      return 'warning'
  }
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
  {
    title: 'Payment Method',
    key: 'payment.method',
    align: Align.START,
    value: (order: OrderResponse) => order.payment.method.toLowerCase().replace(/_/g, ' '),
  },
  {
    title: 'Order Status',
    key: 'status',
    align: Align.START,
  },
]

const { showError } = useNotificationStore()

const isLoading = ref(true)
const queryParams = reactive<PaginatedRequest>({
  page: 0,
  size: 10,
})
const orderData = ref<OrderResponse[]>([])
const totalPages = ref(0)
const totalOrderData = ref(0)

const getOrders = async () => {
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

watch(queryParams, getOrders, { deep: true, immediate: true })
</script>

<template>
  <v-card width="100%" max-width="75rem" class="border-sm border-info mx-auto mb-8">
    <v-container class="d-flex flex-column justify-center pa-0">
      <v-card-title class="border-b-sm border-info text-h6 text-left" style="padding: 1rem 1.5rem">
        Order History
      </v-card-title>
      <v-card-text class="pa-0">
        <v-data-table-server
          class="w-100"
          item-value="orderUuid"
          :headers="headerData"
          :items-length="totalOrderData"
          :loading="isLoading"
          :items="orderData"
          :items-per-page-options="[10, 25, 50, 100]"
          @update:options="onUpdateOptions"
        >
          <template #[`item.status`]="{ value }">
            <v-chip size="small" :color="getStatusColor(value)">{{
              value.toLowerCase().replace(/_/g, ' ')
            }}</v-chip>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-container>
  </v-card>
</template>

<style scoped></style>
