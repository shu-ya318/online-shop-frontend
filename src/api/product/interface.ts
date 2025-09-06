import type { AvailabilityStatus, Category } from '@/types/common'

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
