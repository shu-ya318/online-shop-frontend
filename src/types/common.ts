// Product
export enum AvailabilityStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum Category {
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits',
  PROTEIN = 'protein',
  GRAINS = 'grains',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

// Order
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  ON_THE_WAY = 'ON_THE_WAY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

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
