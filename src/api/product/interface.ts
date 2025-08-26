export interface ProductDetailRequest {
  uuid: string
}

export interface ProductsRequest {
  page: number
  filter: string
  size: number
  sort: string
}

export interface ProductDetailResponse {
  uuid: string
  name: string
  availabilityStatus: string
  updatedAt: Date
  sku: string
  price: number
  discountPercentage: number
  discountedPrice: number
  description: string
  category: string
  stock: number
  totalSold: number
  imageUrl: string
}

export interface ProductsResponse {
  content: ProductDetailResponse[]
  currentPage: number
  size: number
  totalPages: number
  totalElements: number
}
