import { AxiosError } from 'axios'

export const handleApiError = (error: unknown, defaultMessage?: string): never => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const { status, data } = error.response
      const errorMessage = data.error.message || defaultMessage

      const apiError = new Error(errorMessage) as Error & { status?: number }
      apiError.status = status

      switch (status) {
        case 404:
          apiError.name = 'NotFoundError'
          throw apiError
        case 400:
          apiError.name = 'BadRequestError'
          throw apiError
        case 401:
        case 403:
          apiError.name = 'AuthorizationError'
          throw apiError
        default:
          apiError.name = status >= 500 ? 'ServerError' : 'UnexpectedError'
          throw apiError
      }
    } else if (error.request) {
      // When the request is made but no response from the server
      const networkError = new Error('networkError') as Error & {
        status?: number
      }

      networkError.name = 'NetworkError'
      throw networkError
    }
  }

  // Handle error not related to axios (e.g. SyntaxError, TypeError, RangeError)
  const errorMessage = error instanceof Error ? error.message : String(error)

  const unknownError = new Error(defaultMessage || errorMessage)
  unknownError.name = 'UnknownError'
  throw unknownError
}
