import type { ProductDetailResponse } from '@/api/product/interface'

export const hasDiscount = (product: ProductDetailResponse | null): boolean => {
  if (!product || !product.discountPrice || !product.price) return false

  const isShowDiscountPrice = Math.round(product.discountPrice) < Math.round(product.price)
  return isShowDiscountPrice
}
