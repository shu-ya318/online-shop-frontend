import type { AvailabilityStatus } from '@/enums/product/availabilityStatus'
import type { Category } from '@/enums/product/category'
import type { PaginatedRequest } from '@/types/common'

export interface ProductsRequest extends PaginatedRequest {
  name: string
  category: string
}

export interface ProductDetailRequest {
  uuid: string
}

export interface ProductDetailResponse {
  uuid: string
  name: string
  availabilityStatus: AvailabilityStatus
  sku: string
  price: number
  discountPercentage: number
  discountPrice: number
  description: string
  category: Category
  stock: number
  totalSold: number
  imageUrl: string
}
