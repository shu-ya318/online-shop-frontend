import axios from 'axios'
import JSONbig from 'json-bigint'

import { API_ENDPOINT } from '@/configs'

import { getToken } from '@/service/tokenService'
import { handleApiError } from './errorHandler'

const JSONbigString = JSONbig({
  storeAsString: true,
})

const isValidJsonString = (data: unknown): data is string => {
  if (typeof data !== 'string') {
    return false
  }

  try {
    JSON.parse(data)
    return true
  } catch {
    return false
  }
}

const hasUnsafeIntegers = (jsonString: string): boolean => {
  const UNSAFE_INTEGER_PATTERN = /:\s*(-?\d{16,})/
  return UNSAFE_INTEGER_PATTERN.test(jsonString)
}

export const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // Use JSONBig only for JSON strings that contain large numbers to prevent precision loss
  transformResponse: [
    (data) => {
      if (isValidJsonString(data)) {
        if (hasUnsafeIntegers(data)) {
          try {
            return JSONbigString.parse(data)
          } catch (error) {
            console.warn('Parse response with JSONbig failed:', error)
            return JSON.parse(data)
          }
        } else {
          return JSON.parse(data)
        }
      }

      return data
    },
  ],
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  // Success
  (response) => response,
  // Failed
  async (error) => {
    return Promise.reject(handleApiError(error))
  },
)
