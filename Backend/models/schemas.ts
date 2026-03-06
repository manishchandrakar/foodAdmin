import { z } from "zod";
import { NAME_REGEX, PASSWORD_REGEX, PHONE_REGEX, COUPON_CODE_REGEX } from "./regex";

// ─── Helper ──────────────────────────────────────────────────────────────────
export const parseId = (
  id: string,
): { success: true; id: number } | { success: false; error: string } => {
  const num = parseInt(id, 10);
  if (isNaN(num) || num <= 0)
    return { success: false, error: "Invalid ID: must be a positive integer" };
  return { success: true, id: num };
};

// ─── Customer Auth ───────────────────────────────────────────────────────────
export const CustomerRegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(NAME_REGEX, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string().trim().toLowerCase().email().max(255),
  phone: z.string().trim().regex(PHONE_REGEX, "Invalid phone number").optional().or(z.literal("")),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(PASSWORD_REGEX, "Password must contain uppercase, lowercase, number and special character"),
});

export const CustomerLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const SendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
});

export const VerifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// ─── User ─────────────────────────────────────────────────────────────────────
export const UserCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(NAME_REGEX, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string().trim().toLowerCase().email().max(255),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(PASSWORD_REGEX, "Password must contain uppercase, lowercase, number and special character"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  role: z.enum(["admin", "subAdmin", "customer"]).default("subAdmin"),
  customerType: z.enum(["b2c", "b2b"]).default("b2c"),
});

export const UserUpdateSchema = UserCreateSchema.partial();

// ─── Vendor ───────────────────────────────────────────────────────────────────
export const VendorCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(255),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  gstin: z
    .string()
    .trim()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)",
    )
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "inactive", "pending"]).default("active"),
});

export const VendorUpdateSchema = VendorCreateSchema.partial();

// ─── Category ─────────────────────────────────────────────────────────────────
export const CategoryCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
  image: z.string().trim().max(2048).optional().or(z.literal("")),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();

// ─── Unit ─────────────────────────────────────────────────────────────────────
export const UnitCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  symbol: z.string().trim().min(1).max(10),
});

export const UnitUpdateSchema = UnitCreateSchema.partial();

// ─── GstRate ──────────────────────────────────────────────────────────────────
export const GstRateCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  percentage: z.number().min(0).max(100),
});

export const GstRateUpdateSchema = GstRateCreateSchema.partial();

// ─── Product ──────────────────────────────────────────────────────────────────
export const ProductCreateSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(5).max(1000),
  price: z.number().positive().max(999999.99),
  mrp: z.number().positive().max(999999.99).optional(),
  b2bPrice: z.number().positive().max(999999.99).optional(),
  minOrderQty: z.number().int().min(1).max(100000).optional(),
  stock: z.number().int().min(0).max(1000000),
  image: z.string().trim().max(2048).optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "out_of_stock"]).default("active"),
  categoryId: z.number().int().positive().optional(),
  unitId: z.number().int().positive().optional(),
  gstRateId: z.number().int().positive().optional(),
  vendorId: z.number().int().positive().optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

// ─── Order ────────────────────────────────────────────────────────────────────
const OrderItemInputSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(10000),
  price: z.number().positive().max(999999.99),
});

export const OrderCreateSchema = z.object({
  totalAmount: z.number().positive().max(9999999.99),
  paymentMethod: z.enum(["cash", "card", "upi", "netbanking", "wallet"]),
  address: z.string().trim().min(10).max(500),
  userId: z.number().int().positive(),
  items: z.array(OrderItemInputSchema).min(1).max(100),
});

export const CustomerOrderCreateSchema = z.object({
  totalAmount: z.number().positive().max(9999999.99),
  paymentMethod: z.enum(["cash", "card", "upi", "netbanking", "wallet"]),
  address: z.string().trim().min(10).max(500),
  couponCode: z.string().trim().optional().or(z.literal("")),
  items: z.array(OrderItemInputSchema).min(1).max(100),
});

export const OrderUpdateSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .optional(),
  paymentMethod: z
    .enum(["cash", "card", "upi", "netbanking", "wallet"])
    .optional(),
  address: z.string().trim().min(10).max(500).optional(),
});

// ─── Payment ──────────────────────────────────────────────────────────────────
export const PaymentCreateSchema = z.object({
  transactionId: z.string().trim().min(3).max(100).optional().or(z.literal("")),
  paymentStatus: z
    .enum(["pending", "completed", "failed", "refunded"])
    .default("pending"),
  orderId: z.number().int().positive(),
});

export const PaymentUpdateSchema = z.object({
  transactionId: z.string().trim().min(3).max(100).optional(),
  paymentStatus: z
    .enum(["pending", "completed", "failed", "refunded"])
    .optional(),
});

// ─── Coupon ───────────────────────────────────────────────────────────────────
export const CouponCreateSchema = z.object({
  code: z
    .string()
    .trim()
    .transform((s) => s.toUpperCase())
    .refine((s) => s.length >= 3, "Coupon code must be at least 3 characters")
    .refine((s) => s.length <= 20, "Coupon code must be at most 20 characters")
    .refine(
      (s) => COUPON_CODE_REGEX.test(s),
      "Code must contain only uppercase letters and numbers",
    ),
  discountPercent: z.number().int().min(1).max(100),
  expiryDate: z.coerce
    .date()
    .refine((d) => d > new Date(), "Expiry date must be in the future")
    .optional(),
  status: z.enum(["active", "inactive", "expired"]).default("active"),
});

export const CouponUpdateSchema = z.object({
  code: z
    .string()
    .trim()
    .transform((s) => s.toUpperCase())
    .refine((s) => s.length >= 3, "Coupon code must be at least 3 characters")
    .refine((s) => s.length <= 20, "Coupon code must be at most 20 characters")
    .refine(
      (s) => COUPON_CODE_REGEX.test(s),
      "Code must contain only uppercase letters and numbers",
    )
    .optional(),
  discountPercent: z.number().int().min(1).max(100).optional(),
  expiryDate: z.coerce
    .date()
    .refine((d) => d > new Date(), "Expiry date must be in the future")
    .optional(),
  status: z.enum(["active", "inactive", "expired"]).optional(),
});

// ─── Review ───────────────────────────────────────────────────────────────────
export const ReviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(1000),
  userId: z.number().int().positive(),
  productId: z.number().int().positive(),
});

export const ReviewUpdateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().trim().min(3).max(1000).optional(),
});

// ─── Cart ─────────────────────────────────────────────────────────────────────
const CartItemInputSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(10000),
  price: z.number().positive().max(999999.99),
});

export const CartCreateSchema = z.object({
  userId: z.number().int().positive(),
  items: z.array(CartItemInputSchema).min(1).max(100),
});

export const CartUpdateSchema = z.object({
  status: z.enum(["active", "checked_out", "abandoned"]).optional(),
});

export const CartItemAddSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(10000),
  price: z.number().positive().max(999999.99),
});

export const CartItemUpdateSchema = z.object({
  quantity: z.number().int().min(1).max(10000),
});

export const CartCheckoutSchema = z.object({
  paymentMethod: z.enum(["cash", "card", "upi", "netbanking", "wallet"]),
  address: z.string().trim().min(10).max(500),
  couponCode: z
    .string()
    .trim()
    .transform((s) => s.toUpperCase())
    .refine(
      (s) => s.length === 0 || (s.length >= 3 && s.length <= 50),
      "Coupon code must be 3-50 characters",
    )
    .optional()
    .or(z.literal("")),
});
