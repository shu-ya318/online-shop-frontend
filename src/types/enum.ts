export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

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

// Order
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  ON_THE_WAY = 'ON_THE_WAY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Payment
export enum PaymentMethod {
  PAYPAL = 'PAYPAL',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export enum PaymentStatus {
  PAY_ON_DELIVERY = 'PAY_ON_DELIVERY',
  AUTHORIZED = 'AUTHORIZED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}
