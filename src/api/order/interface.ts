import type { OrderStatus, PaymentMethod, PaymentStatus } from '@/types/enum'

export interface OrderCreateRequest {
  recipientName: string
  recipientPhoneNumber: string
  recipientAddress: string
  orderNotes: string
  paymentMethod: string
  items: {
    productUuid: string
    quantity: number
  }[]
}

export interface OrderResponse {
  orderUuid: string
  userUuid: string
  status: OrderStatus
  items: {
    productUuid: string
    productName: string
    unitPrice: number
    discountPercentage: number
    discountPrice: number
    imageUrl: string
    quantity: number
  }[]
  subtotal: number
  shipping: number
  total: number
  totalQuantity: number
  payment: {
    uuid: string
    status: PaymentStatus
    method: PaymentMethod
    amount: number
    currency: string
  }
}
