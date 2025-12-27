<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useRouter, useRoute, type LocationQuery } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { storeToRefs } from 'pinia'
import { z } from 'zod'

import { useNotificationStore } from '@/stores/notificationStore'
import { useUserStore } from '@/stores/userStore'
import { useCartStore } from '@/stores/cartStore'
import { hasDiscount } from '@/utils/hasDiscount'

import BillingInfo from '@/components/dashboard/order/BillingInfo.vue'
import CheckoutSummaryCard from '@/components/common/CheckoutSummaryCard.vue'

import { cancelUserOrderByUuid, createUserOrder } from '@/api/order'
import { createUserPayment as createPaymentApi, captureUserPayment } from '@/api/payment'

import { PaymentMethod, PaymentStatus } from '@/types/enum'
import type { PaymentResponse } from '@/api/payment/interface'

const Orderschema = z.object({
  orderNotes: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  // User info
  userEmail: z.string(),
  username: z.string(),
  userPhoneNumber: z.string(),
  userAddress: z.string(),
  // Recipient info
  isSameAsUserInfo: z.boolean().optional(),
  recipientName: z.string().min(1, { message: 'Name is required' }),
  recipientPhoneNumber: z
    .string()
    .min(10, { message: 'Phone number must be 10 digits' })
    .max(10, { message: 'Phone number must be 10 digits' }),
  recipientAddress: z.string().min(1, 'Address is required'),
})

export type Order = z.infer<typeof Orderschema>

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const cartStore = useCartStore()
const { cart, isLoading } = storeToRefs(cartStore)
const { getUserCart } = cartStore

const { showSuccess, showError } = useNotificationStore()

const {
  handleSubmit,
  defineField,
  resetForm,
  setFieldValue,
  isSubmitting,
} = useForm<Order>({
  initialValues: {
    orderNotes: '',
    // User info
    userEmail: '',
    username: '',
    userPhoneNumber: '',
    userAddress: '',
    // Recipient info
    isSameAsUserInfo: false,
    recipientName: '',
    recipientPhoneNumber: '',
    recipientAddress: '',
    paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
  },
  validationSchema: toTypedSchema(Orderschema),
})

const [orderNotes] = defineField('orderNotes')
const [paymentMethod] = defineField('paymentMethod')
// User info
const [userEmail] = defineField('userEmail')
const [username] = defineField('username')
const [userPhoneNumber] = defineField('userPhoneNumber')
const [userAddress] = defineField('userAddress')
// Recipient info
const [isSameAsUserInfo] = defineField('isSameAsUserInfo')
const [recipientName] = defineField('recipientName')
const [recipientPhoneNumber] = defineField('recipientPhoneNumber')
const [recipientAddress] = defineField('recipientAddress')

const onOrder = handleSubmit(async (values) => {
  try {
    if (!cart.value || !cart.value.items || cart.value.items.length === 0) {
      showError('No items in cart, please add items to cart first!')
      return
    }

    // Create order
    const orderRequest = {
      recipientName: values.recipientName,
      recipientPhoneNumber: values.recipientPhoneNumber,
      recipientAddress: values.recipientAddress,
      orderNotes: values.orderNotes || '',
      paymentMethod: values.paymentMethod,
      items: cart.value.items.map((item) => ({
        productUuid: item.productUuid,
        quantity: item.quantity,
      })),
    }

    const { orderUuid } = await createUserOrder(orderRequest)
    showSuccess('Order created successfully!Proceeding to payment...')

    // Create payment
    const paymentRequest = {
      orderUuid,
      method: values.paymentMethod,
    }
    const paymentResponse = await createPaymentApi(paymentRequest)

    await createUserPayment(orderUuid, values.paymentMethod, paymentResponse)
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  }
})

const createUserPayment = async (
  orderUuid: string,
  paymentMethod: PaymentMethod,
  paymentResponse: PaymentResponse,
) => {
  if (paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
    showSuccess('Order placed successfully with Cash on Delivery!')
    setTimeout(() => {
      router.push({ name: 'order-detail', params: { orderUuid: `${orderUuid}` } })
    }, 500)
  } else if (paymentMethod === PaymentMethod.PAYPAL) {
    if (paymentResponse.redirectUrl) {
      showSuccess('Redirecting to PayPal for payment authorization...')
      window.location.href = paymentResponse.redirectUrl
    } else {
      throw new Error('PayPal payment initiation failed: Missing redirect URL!')
    }
  }
}

const handlePaypalCallback = async (query: LocationQuery) => {
  const { paymentId, PayerID: payerId } = query

  try {
    const captureResponse = await captureUserPayment({
      paymentId: paymentId as string,
      payerId: payerId as string,
    })

    if (captureResponse.status === PaymentStatus.SUCCESS) {
      showSuccess('Payment successful!')
      router.replace({
        name: 'order-detail',
        params: { orderUuid: `${captureResponse.orderUuid}` },
      })
    }
  } catch {
    showError('Payment failed. Please try again!')
  }
}

const handlePaypalCancellation = async (query: LocationQuery) => {
  const { orderUuid } = query
  if (!orderUuid) return

  try {
    await cancelUserOrderByUuid(orderUuid as string)
    showSuccess('Order has been cancelled!')
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError('Failed to cancel order!')
    }
  } finally {
    router.replace({ name: 'order-detail', params: { orderUuid: orderUuid as string } })
  }
}

const onNavigateToProducts = () => {
  router.push({ name: 'products' })
}

onMounted(() => {
  getUserCart()
})

watch(
  () => route.query,
  (query) => {
    const { status, paymentId, PayerID, orderUuid } = query
    if (status === PaymentStatus.CANCELLED && orderUuid) {
      handlePaypalCancellation(query)
    } else if (paymentId && PayerID) {
      handlePaypalCallback(query)
    }
  },
  { immediate: true },
)

watch(
  () => userInfo.value,
  (userInfo) => {
    if (userInfo) {
      resetForm({
        values: {
          userEmail: userInfo.email,
          username: userInfo.name,
          userPhoneNumber: userInfo.phoneNumber,
          userAddress: userInfo.address,
        },
      })
    }
  },
  { deep: true, immediate: true },
)

watch(isSameAsUserInfo, (isSame) => {
  if (isSame) {
    setFieldValue('recipientName', username.value)
    setFieldValue('recipientPhoneNumber', userPhoneNumber.value)
    setFieldValue('recipientAddress', userAddress.value)
  } else {
    setFieldValue('recipientName', '')
    setFieldValue('recipientPhoneNumber', '')
    setFieldValue('recipientAddress', '')
  }
})
</script>

<template>
  <v-layout width="70%" max-width="75rem" class="d-flex flex-column mx-auto py-8">
    <form @submit="onOrder">
      <v-row>
        <!-- Billing Info -->
        <v-col cols="12" sm="8" md="8" lg="8" xl="8">
          <billing-info
            v-model:userEmail="userEmail"
            v-model:username="username"
            v-model:userPhoneNumber="userPhoneNumber"
            v-model:userAddress="userAddress"
            v-model:isSameAsUserInfo="isSameAsUserInfo"
            v-model:recipientName="recipientName"
            v-model:recipientPhoneNumber="recipientPhoneNumber"
            v-model:recipientAddress="recipientAddress"
            v-model:orderNotes="orderNotes"
          />
        </v-col>
        <!-- Order Summary -->
        <v-col cols="12" sm="4" md="4" lg="4" xl="4">
          <!-- Loader -->
          <v-skeleton-loader v-if="isLoading" type="card"></v-skeleton-loader>
          <!-- Result : Error -->
          <v-card
            v-else-if="!cart"
            class="d-flex flex-column justify-center align-center ga-1 border-sm rounded-lg pa-6"
            style="min-height: 20rem"
          >
            <v-icon icon="mdi-alert-circle-outline" size="x-large" color="error" />
            <div class="text-subtitle-2 text-secondary my-4">Failed to load cart data!</div>
            <v-btn
              variant="tonal"
              color="info"
              class="px-3 text-subtitle-2"
              @click="onNavigateToProducts"
            >
              Return to shop
            </v-btn>
          </v-card>
          <!-- Result : Success -->
          <CheckoutSummaryCard
            v-else
            :cart="cart"
            title="Order Summary"
          >
            <!-- Order Items -->
            <template #items>
              <div v-if="cart">
                <div
                  v-for="item in cart.items"
                  :key="item.productUuid"
                  class="d-flex justify-space-between align-center mb-4"
                >
                  <div class="d-flex align-center text-body-1 text-primary">
                    <!-- Image -->
                    <v-img
                      :src="item.imageUrl"
                      :alt="item.productName"
                      width="60"
                      height="60"
                      class="mr-4"
                    />
                    <!-- Name and Quantity -->
                    <div>{{ item.productName }} x{{ item.quantity }}</div>
                  </div>
                  <!-- Subtotal -->
                  <div class="text-body-1 text-primary">
                    ${{
                      hasDiscount(item)
                        ? Math.round(item.discountPrice) * item.quantity
                        : Math.round(item.price) * item.quantity
                    }}
                  </div>
                </div>
              </div>
            </template>
            <!-- Payment Method -->
            <template #payment-method>
              <!-- Subtitle -->
              <v-card-title>Payment Method</v-card-title>
              <!-- Options -->
              <v-radio-group v-model="paymentMethod" color="success">
                <v-radio label="Cash on delivery" :value="PaymentMethod.CASH_ON_DELIVERY"></v-radio>
                <v-radio label="Paypal" :value="PaymentMethod.PAYPAL"></v-radio>
              </v-radio-group>
              <v-alert
                v-if="paymentMethod === PaymentMethod.PAYPAL"
                color="warning"
                variant="tonal"
                density="compact"
                class="mb-5 text-caption"
              >
                If the payment is not completed within 1 hour, the order will be cancelled. You will
                need to add the items to your cart again.
              </v-alert>
            </template>
            <!-- Submit button -->
            <template #button>
              <v-btn
                color="success"
                :loading="isLoading"
                :disabled="isSubmitting"
                :block="true"
                type="submit"
                >Submit order</v-btn
              >
            </template>
          </CheckoutSummaryCard>
        </v-col>
      </v-row>
    </form>
  </v-layout>
</template>

<style scoped></style>
