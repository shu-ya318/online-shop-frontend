import type { SortBy, SortDirection } from '@/types/enum'

// Paginated
export interface PaginatedRequest {
    page: number
    size: number
}

export interface FilteredPaginatedRequest extends PaginatedRequest {
    keyword?: string
    category?: string
    sortBy: SortBy
    sortDirection: SortDirection
}

export interface PaginatedResponse<T> {
    content: T[]
    currentPage: number
    size: number
    totalPages: number
    totalElements: number
}

// Success
export interface SuccessResponse {
    message: string
}
