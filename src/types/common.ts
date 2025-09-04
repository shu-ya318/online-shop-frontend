export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortString = `${string},${SortDirection}`

export interface PaginatedRequest {
  // filter: string
  page: number
  size: number
  sort: SortString | ''
}

export interface PaginatedResponse<T> {
  content: T[]
  currentPage: number
  size: number
  totalPages: number
  totalElements: number
}
