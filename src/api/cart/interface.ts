export interface AddCartItemRequest {
  productUuid: string
  quantity: number
}

export interface CartItem {
  productUuid: string
  productName: string
  price: number
  discountPercentage: number
  discountPrice: number
  quantity: number
  imageUrl: string
}

export interface CartResponse {
  cartUuid: string
  userUuid: string
  items: CartItem[]
  total: number
  discountTotal: number
  totalQuantity: number
}

export interface UpdateCartItemQuantityRequest {
  productUuid: string
  quantity: number
}
