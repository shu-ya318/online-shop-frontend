import axios from 'axios'
import { storeToRefs } from 'pinia'
import qs from 'qs'

import { useUserStore } from '@/stores/userStore'

import { refreshToken } from '@/api/user'

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Initialize axios instance
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    },
  },
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const { accessToken } = storeToRefs(userStore)
    console.log(
      `[AXIOS] Request: ${config.method?.toUpperCase()} ${config.url}`,
      config.params ? { params: config.params } : '',
      config.data ? { data: config.data } : '',
    )
    if (accessToken.value) config.headers.Authorization = `Bearer ${accessToken.value}`

    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor
let isRefreshing = false
const failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue.length = 0
}

const publicUrls = [
  '/public/users/register',
  '/public/users/login',
  '/public/users/refresh-token',
  '/public/users/oauth2/exchange-code',
  '/public/users/logout',
]

service.interceptors.response.use(
  // Success
  (response) => response,
  // Failed
  async (error) => {
    const originalRequest = error.config

    // Token refresh handling
    if (error.response?.status === 401 && !publicUrls.includes(originalRequest.url)) {
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

      const userStore = useUserStore()

      try {
        const response = await refreshToken()
        userStore.setAccessToken(response.accessToken)
        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
        processQueue(null, response.accessToken)
        return service(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        userStore.logout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Error handling
    if (error.response && error.response.data && error.response.data.message) {
      error.message = error.response.data.message
    } else if (!error.response) {
      error.message = 'Network error, please check your network!'
    }

    return Promise.reject(error)
  },
)

// Axios API interface
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
  patch<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return service.patch(url, data, config) as Promise<AxiosResponse<T>>
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return service.delete(url, config) as Promise<AxiosResponse<T>>
  },
}

export default api
