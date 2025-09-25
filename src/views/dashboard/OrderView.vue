<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

import { createUserOrder } from '@/api/order'
import { createPayment } from '@/api/payment'

import { PaymentMethod } from '@/types/common'
import type { OrderCreateRequest } from '@/api/order/interface'
import type { PaymentCreateRequest, PaymentResponse } from '@/api/payment/interface'

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

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const cartStore = useCartStore()
const { cart } = storeToRefs(cartStore)
const { fetchUserCart } = cartStore

const { showSuccess, showError } = useNotificationStore()

const { handleSubmit, defineField, resetForm, setFieldValue } = useForm<Order>({
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
    const orderRequest: OrderCreateRequest = {
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
    const paymentRequest: PaymentCreateRequest = {
      orderUuid,
      method: values.paymentMethod,
    }
    const paymentResponse = await createPayment(paymentRequest)

    await processPayment(orderUuid, values.paymentMethod, paymentResponse)
  } catch (error) {
    if (error instanceof Error) {
      showError(error.message)
    } else {
      showError(String(error))
    }
  }
})

const processPayment = async (
  orderUuid: string,
  paymentMethod: PaymentMethod,
  paymentResponse: PaymentResponse
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

onMounted(() => {
  fetchUserCart()
})

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

// TODO: 可能修改寫法
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
    <!-- <div class="w-100 d-flex align-center mx-auto mt-8"> -->
    <!-- <v-container fluid class="pa-0">
        <v-row no-gutters class="fill-height"> -->
    <vee-form>
      <v-row>
        <!-- Billing Info -->
        <v-col cols="12" sm="8" md="8" lg="8" xl="8">
          <billing-info v-model:userEmail="userEmail" v-model:username="username"
            v-model:userPhoneNumber="userPhoneNumber" v-model:userAddress="userAddress"
            v-model:isSameAsUserInfo="isSameAsUserInfo" v-model:recipientName="recipientName"
            v-model:recipientPhoneNumber="recipientPhoneNumber" v-model:recipientAddress="recipientAddress"
            v-model:orderNotes="orderNotes" />
        </v-col>
        <!-- Order Summary -->
        <v-col cols="12" sm="4" md="4" lg="4" xl="4">
          <!-- Loader -->
          <!-- Result : Error -->
          <!-- Result : Success -->
          <CheckoutSummaryCard title="Order Summary" button-text="Submit order" button-type="submit" @submit="onOrder">
            <!-- Order Items -->
            <template #items>
              <div v-if="cart">
                <div v-for="item in cart.items" :key="item.productUuid"
                  class="d-flex justify-space-between align-center mb-4">
                  <div class="d-flex align-center text-body-1 text-primary">
                    <!-- Image -->
                    <v-img :src="item.imageUrl" :alt="item.productName" width="60" height="60" class="mr-4" />
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
            </template>
          </CheckoutSummaryCard>
        </v-col>
      </v-row>
    </vee-form>
    <!-- </v-row>
    <v-container> -->
    <!-- </div> -->
  </v-layout>
</template>

<style scoped></style>
