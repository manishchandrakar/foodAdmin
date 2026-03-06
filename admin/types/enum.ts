export enum EnumUserRole {
  ADMIN = "admin",
  SUB_ADMIN = "subAdmin",
  CUSTOMER = "customer",
}

export enum EnumCustomerType {
  B2C = "b2c",
  B2B = "b2b",
}

export enum EnumStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
}

export enum EnumVendorStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

export enum EnumOrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum EnumPaymentMethod {
  CASH = "cash",
  CARD = "card",
  UPI = "upi",
  NETBANKING = "netbanking",
  WALLET = "wallet",
}

export enum EnumCouponStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
}

export enum EnumCartStatus {
  ACTIVE = "active",
  CHECKED_OUT = "checked_out",
  ABANDONED = "abandoned",
}

export enum EnumTransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}
