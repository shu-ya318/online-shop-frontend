import type { PaymentMethod, PaymentStatus } from '@/types/common/enum'

export interface PaymentCreateRequest {
  method: PaymentMethod
  orderUuid: string
}

export interface PaymentResponse {
  uuid: string
  transactionId: string
  status: PaymentStatus
  method: PaymentMethod
  amount: number
  currency: string
  orderUuid: string
  redirectUrl: string
}

export interface PaymentSummary {
  uuid: string
  status: PaymentStatus
  method: PaymentMethod
  amount: number
  currency: string
}
