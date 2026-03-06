import type {
  ICategory,
  IUnit,
  IGstRate,
  IProduct,
  IUser,
  IOrder,
  IOrderItem,
  IPayment,
  ICart,
  ICartItem,
  IReview,
  ICoupon,
  IVendor,
} from "./entities";

// ─── Generic Response Utilities ───────────────────────────────────────────

/** Shape of every error response returned by the API */
export interface IApiErrorResponse {
  error: string | Record<string, unknown>;
}

/** Shape of every successful DELETE response */
export interface IApiDeleteResponse {
  success: boolean;
}

// ─── Flat Entity Responses (no nested relations) ──────────────────────────

/** GET /api/categories — flat, no includes */
export type ICategoryResponse = ICategory;

/** GET /api/units — flat, no includes */
export type IUnitResponse = IUnit;

/** GET /api/gst-rates — flat, no includes */
export type IGstRateResponse = IGstRate;

/** GET /api/coupons — flat, no includes */
export type ICouponResponse = ICoupon;

/** GET /api/users — flat, no includes */
export type IUserResponse = IUser;

/** GET /api/payments — flat, no includes */
export type IPaymentResponse = IPayment;

/** GET /api/vendors — with product count */
export type IVendorResponse = IVendor;

// ─── Entity Responses with Resolved Relations ─────────────────────────────

/**
 * GET /api/products — Prisma `include: { category, unit, gstRate, vendor }`.
 * All relations are always present (nullable if FK is unset).
 */
export interface IProductResponse extends Omit<IProduct, "category" | "unit" | "gstRate" | "vendor"> {
  category: ICategory | null;
  unit: IUnit | null;
  gstRate: IGstRate | null;
  vendor: IVendor | null;
}

/** Order item as returned when nested inside an IOrderResponse */
export interface IOrderItemResponse extends Omit<IOrderItem, "product" | "unit"> {
  product?: IProduct;
  unit?: IUnit | null;
}

/**
 * GET /api/orders — Prisma `include: { user, orderItems }`.
 * `user` and `orderItems` are always present in the response.
 */
export interface IOrderResponse extends Omit<IOrder, "user" | "orderItems" | "payments"> {
  user: IUser;
  orderItems: IOrderItemResponse[];
  payments?: IPayment[];
}

/** Cart item as returned when nested inside an ICartResponse */
export interface ICartItemResponse extends Omit<ICartItem, "product" | "unit"> {
  product?: IProduct;
  unit?: IUnit | null;
}

/**
 * GET /api/cart — Prisma `include: { user, cartItems }`.
 * `user` and `cartItems` are always present in the response.
 */
export interface ICartResponse extends Omit<ICart, "user" | "cartItems"> {
  user?: IUser;
  cartItems?: ICartItemResponse[];
}

/**
 * GET /api/reviews — includes user and product relations.
 */
export interface IReviewResponse extends Omit<IReview, "user" | "product"> {
  user?: IUser;
  product?: IProduct;
}
