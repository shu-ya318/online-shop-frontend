import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios'
import JSONbig from 'json-bigint'

import { useNotification } from '@/composables/useNotification'

import { getToken } from '@/service/tokenService'

const { showError } = useNotification()

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
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

service.interceptors.response.use(
  // Success
  (response: AxiosResponse) => response,
  // Failed
  async (error) => {
    if (error instanceof AxiosError) {
      // Situation 1: The request was made and the server response
      if (error.response) {
        const errorMessage =
          error.response.data?.error?.message || 'An unexpected error occurred. Please try again!'
        showError(errorMessage)
      } else if (error.request) {
        // Situation 2:When the request is made but no response from the server
        showError('Network error, please check your network!')
      }
    } else {
      // Situation 3: Handle error not related to axios (e.g. SyntaxError)
      showError('An unknown error occurred. Please try again!')
    }

    // Return a custom error object with the error description instead of reject
    return Promise.resolve({
      data: error.response?.data ?? null,
      status: error.response?.status ?? 0,
      statusText: error.response?.statusText ?? error.message,
      headers: error.response?.headers ?? {},
      config: error.config!,
      request: error.request ?? null,
    })
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
