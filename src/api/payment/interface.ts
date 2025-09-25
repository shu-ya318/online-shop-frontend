import type { PaymentMethod, PaymentStatus } from './enum'

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
