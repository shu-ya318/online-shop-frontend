import type { ProductDetailResponse } from '@/api/product/interface'
import type { CartItem } from '@/api/cart/interface'

export const hasDiscount = (item: ProductDetailResponse | CartItem | null): boolean => {
  if (!item || !item.discountPrice || !item.price) return false

  const isShowDiscountPrice = Math.round(item.discountPrice) < Math.round(item.price)
  return isShowDiscountPrice
}
