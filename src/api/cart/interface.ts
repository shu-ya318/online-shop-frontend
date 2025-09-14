export interface CartAddItemRequest {
  productUuid: string
  quantity: number
}

export interface CartItem {
  productUuid: string
  productName: string
  price: number
  discountPercentage: number
  discountPrice: number
  imageUrl: string
  quantity: number
}

export interface CartResponse {
  cartUuid: string
  userUuid: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  totalQuantity: number
}

export interface CartItemQuantityUpdateRequest {
  productUuid: string
  quantity: number
}
