import axios from 'axios'
import JSONbig from 'json-bigint'

import { useUserStore } from '@/stores/userStore'

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

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

const service: AxiosInstance = axios.create({
  baseURL: '/api',
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
          } catch {
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

service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token

    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error) => Promise.reject(error),
)

service.interceptors.response.use(
  // Success
  (response) => response,
  // Failed
  async (error) => {
    // Automatically retry the request if it fails due to an expired tokenF
    const originalRequest = error.config

    if (error.response.status === 401 && originalRequest.url !== '/user/refresh-token') {
      const userStore = useUserStore()

      try {
        const newToken = await userStore.refreshToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        service.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

        return service(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    // If the request is being retried, wait for the new token to be available
    let errorMessage = 'An unknown error occurred. Please try again!'

    if (error.response) {
      errorMessage =
        error.response.data?.message || 'An unexpected error occurred. Please try again!'
    } else {
      errorMessage = 'Network error, please check your network!'
    }

    return Promise.reject(new Error(errorMessage))
  },
)

const api = {
  get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return service.get(url, { params, ...config }) as Promise<AxiosResponse<T>>
  },
  post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return service.post(url, data, config) as Promise<AxiosResponse<T>>
  },
  put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return service.put(url, data, config) as Promise<AxiosResponse<T>>
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return service.delete(url, config) as Promise<AxiosResponse<T>>
  },
}

export default api
