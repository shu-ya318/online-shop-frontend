export interface ProductDetailRequest {
  uuid: string
}

export interface ProductDetailResponse {
  uuid: string
  name: string
  availabilityStatus: string
  sku: string
  price: number
  discountPercentage: number
  discountPrice: number
  description: string
  category: string
  stock: number
  totalSold: number
  imageUrl: string
}

export interface ProductsRequest {
  page: number
  filter: string
  size: number
  sort: string
}

export interface ProductsResponse {
  content: ProductDetailResponse[]
  currentPage: number
  size: number
  totalPages: number
  totalElements: number
}
