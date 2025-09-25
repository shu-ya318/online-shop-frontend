import type { OrderStatus } from '@/types/common/enum'
import type { PaymentSummary } from '../payment/interface'

interface OrderItemCreateRequest {
  productUuid: string
  quantity: number
}

export interface OrderCreateRequest {
  recipientName: string
  recipientPhoneNumber: string
  recipientAddress: string
  orderNotes: string
  paymentMethod: string
  items: OrderItemCreateRequest[]
}

export interface PaginatedOrderRequest {
  page: number
  size: number
}

export interface OrderItem {
  productUuid: string
  productName: string
  unitPrice: number
  discountPercentage: number
  discountPrice: number
  imageUrl: string
  quantity: number
}

export interface OrderResponse {
  orderUuid: string
  userUuid: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  totalQuantity: number
  payments: PaymentSummary[]
}
