import api from '@/api/axios/instance'

import type {
  PaymentCaptureRequest,
  PaymentCaptureResponse,
  PaymentCreateRequest,
  PaymentResponse,
} from './interface'

/*
 * POST method
 */

export const createUserPayment = async (request: PaymentCreateRequest): Promise<PaymentResponse> => {
  const response = await api.post<PaymentResponse>('/payments/me', request)

  return response.data
}

export const captureUserPayment = async (
  request: PaymentCaptureRequest,
): Promise<PaymentCaptureResponse> => {
  const response = await api.post<PaymentCaptureResponse>('/payments/me/capture', request)

  return response.data
}
