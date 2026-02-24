import {
  EnumCartStatus,
  EnumCouponStatus,
  EnumOrderStatus,
  EnumPaymentMethod,
  EnumStatus,
  EnumTransactionStatus,
  EnumUserRole,
} from "./enum";

// ─── Base ───
export interface IBaseEntity {
  id: string;
  createdAt?: string;
}

// ─── User ───
export interface IUser extends IBaseEntity {
  name: string;
  email: string;
  phone?: string | null;
  role: EnumUserRole;
  description?: string | null;
  isActive: boolean;
}

// ─── Category ───
export interface ICategory extends IBaseEntity {
  name: string;
  description?: string | null;
  image?: string | null;
}

// ─── Unit ───
export interface IUnit extends IBaseEntity {
  name: string;
  symbol: string;
}

// ─── GstRate ───
export interface IGstRate extends IBaseEntity {
  /** Display label, e.g. "GST 18% — Standard Rate" */
  name: string;
  /** GST percentage value, e.g. 18 */
  percentage: number;
}

// ─── Product ───
export interface IProduct extends IBaseEntity {
  name: string;
  description: string;
  /** Selling price — inclusive of GST (final price the customer pays) */
  price: number;
  /** Maximum Retail Price — shown crossed-out to indicate discount */
  mrp?: number | null;
  stock: number;
  image?: string | null;
  status: EnumStatus;
  categoryId?: number | null;
  category?: ICategory | null;
  unitId?: number | null;
  unit?: IUnit | null;
  gstRateId?: number | null;
  gstRate?: IGstRate | null;
}

// ─── OrderItem ───
export interface IOrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: number;
  productId: number;
  product?: IProduct;
  unitId?: number | null;
  unit?: IUnit | null;
}

// ─── Order ───
export interface IOrder extends IBaseEntity {
  totalAmount: string;
  status: EnumOrderStatus;
  paymentMethod: EnumPaymentMethod;
  address: string;
  couponCode?: string | null;
  userId: string;
  user?: IUser;
  orderItems?: IOrderItem[];
  payments?: IPayment[];
}

// ─── Payment ───
export interface IPayment {
  id: string;
  transactionId?: string | null;
  paymentStatus: EnumTransactionStatus;
  paidAt?: string | null;
  orderId: string;
  order?: IOrder;
}

// ─── Coupon ───
export interface ICoupon {
  id: string;
  code: string;
  discountPercent: number;
  expiryDate?: string | null;
  status: EnumCouponStatus;
}

// ─── Review ───
export interface IReview extends IBaseEntity {
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  user?: IUser;
  product?: IProduct;
}

// ─── CartItem ───
export interface ICartItem {
  id: string;
  quantity: number;
  price: number;
  cartId: number;
  productId: number;
  product?: IProduct;
  unitId?: number | null;
  unit?: IUnit | null;
}

// ─── Cart ───
export interface ICart extends IBaseEntity {
  status: EnumCartStatus;
  userId: string;
  user?: IUser;
  cartItems?: ICartItem[];
}

export interface ISelectDropdownOptions<TValue extends string = string> {
  label: string;
  value: TValue;
}
