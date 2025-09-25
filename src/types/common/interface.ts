import type { SortDirection } from './enum'

// List
export interface PaginatedRequest {
  filter: { [key: string]: string }
  sortBy: string
  sortDirection: SortDirection
  page: number
  size: number
}
export interface PaginatedResponse<T> {
  content: T[]
  currentPage: number
  size: number
  totalPages: number
  totalElements: number
}
