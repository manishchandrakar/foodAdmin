// ─── Base Types matching Prisma Schema ───────────────────────────────────────

export interface IUnit {
  id: number
  name: string
  symbol: string
  createdAt: string
}

export interface ICategory {
  id: number
  name: string
  description?: string
  image?: string
  createdAt: string
}

export interface IGstRate {
  id: number
  name: string
  percentage: number
  createdAt: string
}

export interface IProduct {
  id: number
  name: string
  description: string
  price: number
  mrp?: number
  stock: number
  image?: string
  status: 'active' | 'inactive'
  createdAt: string
  categoryId?: number
  category?: ICategory
  unitId?: number
  unit?: IUnit
  gstRateId?: number
  gstRate?: IGstRate
  reviews?: IReview[]
  avgRating?: number
  totalReviews?: number
}

export interface IUser {
  id: number
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  description?: string
  isActive: boolean
  createdAt: string
}

export interface IReview {
  id: number
  rating: number
  comment: string
  createdAt: string
  userId: number
  user?: IUser
  productId: number
}

export interface IOrderItem {
  id: number
  quantity: number
  price: number
  orderId: number
  productId: number
  product?: IProduct
  unitId?: number
  unit?: IUnit
}

export interface IPayment {
  id: number
  transactionId?: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paidAt?: string
  orderId: number
}

export interface IOrder {
  id: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'cod' | 'online' | 'upi'
  address: string
  couponCode?: string
  createdAt: string
  userId: number
  user?: IUser
  orderItems?: IOrderItem[]
  payments?: IPayment[]
}

export interface ICoupon {
  id: number
  code: string
  discountPercent: number
  expiryDate?: string
  status: 'active' | 'inactive'
}

export interface ICartItem {
  id: number
  quantity: number
  price: number
  cartId: number
  productId: number
  product?: IProduct
  unitId?: number
  unit?: IUnit
}

export interface ICart {
  id: number
  status: 'active' | 'checkout'
  createdAt: string
  userId: number
  cartItems?: ICartItem[]
}

// ─── UI / App Types ───────────────────────────────────────────────────────────

export interface ICartState {
  items: ICartItemLocal[]
  couponCode: string
  couponDiscount: number
}

export interface ICartItemLocal {
  product: IProduct
  quantity: number
  unitId: number
  unitSymbol: string
}

export interface IAuthUser {
  id: number
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
}
