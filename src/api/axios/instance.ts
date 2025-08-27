import axios from 'axios'
import JSONbig from 'json-bigint'

import { useUserStore } from '@/stores/userStore'

import { refreshToken } from '@/api/user'

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
    // const originalRequest = error.config

    // if (error.response.status === 401 && originalRequest.url !== '/user/refresh-token') {
    //   const userStore = useUserStore()

    //   try {
    //     const newToken = await userStore.refreshToken()
    //     originalRequest.headers.Authorization = `Bearer ${newToken}`
    //     service.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

    //     return service(originalRequest)
    //   } catch {
    //     // console.error('Refresh token failed')
    //   }
    // }
    const REFRESH_TOKEN_URL = '/user/refresh-token'

    let isRefreshing = false
    let failedQueue: Array<{
      resolve: (value: unknown) => void
      reject: (reason?: unknown) => void
    }> = []

    const processQueue = (error: unknown, token: string | null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error)
        } else {
          prom.resolve(token)
        }
      })

      failedQueue = []
    }

    const originalRequest = error.config

    if (error.response.status === 401 && originalRequest.url !== REFRESH_TOKEN_URL) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return service(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      isRefreshing = true
      originalRequest._retry = true

      const userStore = useUserStore()

      try {
        const response = await refreshToken()
        userStore.token = response.accessToken
        service.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`
        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`

        processQueue(null, response.accessToken)
      } catch (refreshError) {
        processQueue(refreshError, null)
        userStore.logout()
        // return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
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
