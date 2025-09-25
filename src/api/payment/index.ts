import api from '@/api/axios/instance'

import type { PaymentCreateRequest, PaymentResponse } from './interface'

export const createPayment = async (request: PaymentCreateRequest): Promise<PaymentResponse> => {
  const response = await api.post<PaymentResponse>('/payments/me', request)

  return response.data
}
