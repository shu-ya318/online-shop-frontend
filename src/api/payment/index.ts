import api from '@/api/axios/instance'

import type {
  PaymentCaptureRequest,
  PaymentCaptureResponse,
  PaymentCreateRequest,
  PaymentResponse,
} from './interface'

export const createPayment = async (request: PaymentCreateRequest): Promise<PaymentResponse> => {
  const response = await api.post<PaymentResponse>('/payments/me', request)

  return response.data
}

export const capturePayment = async (
  request: PaymentCaptureRequest,
): Promise<PaymentCaptureResponse> => {
  const response = await api.post<PaymentCaptureResponse>('/payments/me/capture', request)

  return response.data
}
