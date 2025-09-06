export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

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
