import { z } from "zod"
import { NAME_REGEX, PASSWORD_REGEX, PHONE_REGEX, COUPON_CODE_REGEX, GROWTH_REGEX } from "@/utils/regex";
import { EnumOrderStatus, EnumPaymentMethod, EnumStatus, EnumTransactionStatus, EnumUserRole, EnumVendorStatus, EnumCustomerType } from "@/types/enum";
import { IconType } from "react-icons";


 export const iconSchema = z.custom<IconType>((val) => typeof val === "function")

 export const StatSchema = z.object({
   title: z.string().min(1),
   value: z.string().min(1),
   growth: z.string().regex(GROWTH_REGEX, "Growth must be like +12% or -5%"),
   icon: iconSchema,
 })
// ─── Reusable ID Param Validation ───
export const IdParamSchema = z.object({
  id: z.coerce.number().int().positive("ID must be a positive integer"),
})

export const parseId = (id: string): { success: true; id: number } | { success: false; error: string } => {
  const parsed = IdParamSchema.safeParse({ id })
  if (!parsed.success) return { success: false, error: "Invalid ID: must be a positive integer" }
  return { success: true, id: parsed.data.id }
}

// ─── Login ───
export const LoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
})

// ─── User ───
export const UserCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(NAME_REGEX, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least one uppercase, one lowercase, one number, and one special character (@$!%*?&#)"
    ),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Invalid phone number (e.g. +1234567890)")
    .optional()
    .or(z.literal("")),
  role: z.enum(EnumUserRole, {
    message: "Role must be admin, user, manager, or customer",
  }).default(EnumUserRole.SUB_ADMIN),
})

export const UserUpdateSchema = UserCreateSchema.partial()

// ─── Category ───
export const CategoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  image: z
    .string()
    .trim()
    .max(2048, "Image path must be at most 2048 characters")
    .optional()
    .or(z.literal("")),
})

export type CategoryFormValues = z.infer<typeof CategoryCreateSchema>

export const CategoryUpdateSchema = CategoryCreateSchema.partial()

// ─── Unit ───
export const UnitCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Unit name must be at least 2 characters")
    .max(100, "Unit name must be at most 100 characters"),
  symbol: z
    .string()
    .trim()
    .min(1, "Symbol must be at least 1 character")
    .max(10, "Symbol must be at most 10 characters"),
})

export const UnitUpdateSchema = UnitCreateSchema.partial()

// ─── GstRate ───
export const GstRateCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  percentage: z
    .number()
    .min(0, "GST percentage cannot be negative")
    .max(100, "GST percentage cannot exceed 100%"),
})
export const GstRateUpdateSchema = GstRateCreateSchema.partial()

// ─── Vendor ───
export const VendorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Vendor name must be at least 2 characters")
    .max(100, "Vendor name must be at most 100 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Invalid phone number (e.g. +1234567890)")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .max(500, "Address must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  gstin: z
    .string()
    .trim()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)",
    )
    .optional()
    .or(z.literal("")),
  status: z.enum(EnumVendorStatus, {
    message: "Status must be active, inactive, or pending",
  }).default(EnumVendorStatus.ACTIVE),
})

export type VendorFormValues = z.infer<typeof VendorFormSchema>

// ─── Product ───
export const ProductCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name must be at most 150 characters"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(1000, "Description must be at most 1000 characters"),
  price: z
    .number()
    .positive("Selling price must be positive")
    .max(999999.99, "Selling price cannot exceed 999,999.99"),
  mrp: z
    .number()
    .positive("MRP must be positive")
    .max(999999.99, "MRP cannot exceed 999,999.99")
    .optional(),
  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(1000000, "Stock cannot exceed 1,000,000"),
  image: z
    .string()
    .trim()
    .max(2048, "Image path must be at most 2048 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(EnumStatus, {
    message: "Status must be active, inactive, or out_of_stock",
  }).default(EnumStatus.ACTIVE),
  categoryId: z.number().int().positive("Category ID must be a positive integer").optional(),
  unitId: z.number().int().positive("Unit ID must be a positive integer").optional(),
  gstRateId: z.number().int().positive("GST Rate ID must be a positive integer").optional(),
})

export const ProductUpdateSchema = ProductCreateSchema.partial()

// ─── Order ───
const OrderItemInputSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive integer"),
  quantity: z.number().int("Quantity must be a whole number").min(1, "Quantity must be at least 1").max(10000, "Quantity cannot exceed 10,000"),
  price: z.number().positive("Price must be positive").max(999999.99, "Price cannot exceed 999,999.99"),
})

export const OrderCreateSchema = z.object({
  totalAmount: z
    .number()
    .positive("Total amount must be positive")
    .max(9999999.99, "Total amount cannot exceed 9,999,999.99"),
  paymentMethod: z.enum(EnumPaymentMethod, {
    message: "Payment method must be cash, card, upi, netbanking, or wallet",
  }),
  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be at most 500 characters"),
  userId: z.number().int().positive("User ID must be a positive integer"),
  items: z.array(OrderItemInputSchema).min(1, "Order must have at least one item").max(100, "Order cannot have more than 100 items"),
})

export const OrderUpdateSchema = z.object({
  status: z
    .enum(EnumOrderStatus, {
      message: "Status must be pending, confirmed, shipped, delivered, or cancelled",
    })
    .optional(),
  paymentMethod: z
    .enum(EnumOrderStatus, {
      message: "Payment method must be cash, card, upi, netbanking, or wallet",
    })
    .optional(),
  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be at most 500 characters")
    .optional(),
})

// ─── Payment ───
export const PaymentCreateSchema = z.object({
  transactionId: z
    .string()
    .trim()
    .min(3, "Transaction ID must be at least 3 characters")
    .max(100, "Transaction ID must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  paymentStatus: z
    .enum(EnumTransactionStatus, {
      message: "Payment status must be pending, completed, failed, or refunded",
    })
    .default(EnumTransactionStatus.PENDING),
  orderId: z.number().int().positive("Order ID must be a positive integer"),
})

export const PaymentUpdateSchema = z.object({
  transactionId: z
    .string()
    .trim()
    .min(3, "Transaction ID must be at least 3 characters")
    .max(100, "Transaction ID must be at most 100 characters")
    .optional(),
  paymentStatus: z
    .enum(EnumTransactionStatus, {
      message: "Payment status must be pending, completed, failed, or refunded",
    })
    .optional(),
})

// ─── Coupon ───
export const CouponCreateSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be at most 20 characters")
    .regex(COUPON_CODE_REGEX, "Coupon code must contain only uppercase letters and numbers"),
  discountPercent: z
    .number()
    .int("Discount must be a whole number")
    .min(1, "Discount must be at least 1%")
    .max(100, "Discount cannot exceed 100%"),
  expiryDate: z.coerce
    .date()
    .refine((date) => date > new Date(), "Expiry date must be in the future")
    .optional(),
  status: z
    .enum(["active", "inactive", "expired"], {
      message: "Status must be active, inactive, or expired",
    })
    .default("active"),
})

export const CouponUpdateSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be at most 20 characters")
    .regex(COUPON_CODE_REGEX, "Coupon code must contain only uppercase letters and numbers")
    .optional(),
  discountPercent: z
    .number()
    .int("Discount must be a whole number")
    .min(1, "Discount must be at least 1%")
    .max(100, "Discount cannot exceed 100%")
    .optional(),
  expiryDate: z.coerce
    .date()
    .refine((date) => date > new Date(), "Expiry date must be in the future")
    .optional(),
  status: z
    .enum(["active", "inactive", "expired"], {
      message: "Status must be active, inactive, or expired",
    })
    .optional(),
})

// ─── Review ───
export const ReviewCreateSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters")
    .max(1000, "Comment must be at most 1000 characters"),
  userId: z.number().int().positive("User ID must be a positive integer"),
  productId: z.number().int().positive("Product ID must be a positive integer"),
})

export const ReviewUpdateSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),
  comment: z
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters")
    .max(1000, "Comment must be at most 1000 characters")
    .optional(),
})

// ─── Cart ───
const CartItemInputSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive integer"),
  quantity: z.number().int("Quantity must be a whole number").min(1, "Quantity must be at least 1").max(10000, "Quantity cannot exceed 10,000"),
  price: z.number().positive("Price must be positive").max(999999.99, "Price cannot exceed 999,999.99"),
})

export const CartCreateSchema = z.object({
  userId: z.number().int().positive("User ID must be a positive integer"),
  items: z.array(CartItemInputSchema).min(1, "Cart must have at least one item").max(100, "Cart cannot have more than 100 items"),
})

export const CartItemAddSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive integer"),
  quantity: z.number().int("Quantity must be a whole number").min(1, "Quantity must be at least 1").max(10000, "Quantity cannot exceed 10,000"),
  price: z.number().positive("Price must be positive").max(999999.99, "Price cannot exceed 999,999.99"),
})

export const CartItemUpdateSchema = z.object({
  quantity: z.number().int("Quantity must be a whole number").min(1, "Quantity must be at least 1").max(10000, "Quantity cannot exceed 10,000"),
})

export const CartUpdateSchema = z.object({
  status: z.enum(["active", "checked_out", "abandoned"], {
    message: "Status must be active, checked_out, or abandoned",
  }).optional(),
})

export const CartCheckoutSchema = z.object({
  paymentMethod: z.enum(["cash", "card", "upi", "netbanking", "wallet"], {
    message: "Payment method must be cash, card, upi, netbanking, or wallet",
  }),
  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be at most 500 characters"),
  couponCode: z
    .string()
    .trim()
    .toUpperCase()
    .min(3, "Coupon code must be at least 3 characters")
    .max(50, "Coupon code must be at most 50 characters")
    .optional()
    .or(z.literal("")),
})


export const AsideItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().startsWith("/"),
  icon: iconSchema,
})


// ─── Product Form (frontend — IDs are strings from dropdowns) ───
export const ProductFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name must be at most 150 characters"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(1000, "Description must be at most 1000 characters"),
  price: z.preprocess(
    (val) => (typeof val === "number" && isNaN(val)) ? undefined : val,
    z.number().positive("Selling price must be positive").max(999999.99, "Selling price cannot exceed 999,999.99")
  ),
  mrp: z.preprocess(
    (val) => (typeof val === "number" && isNaN(val)) ? undefined : val,
    z.number().positive("MRP must be positive").max(999999.99, "MRP cannot exceed 999,999.99").optional()
  ),
  b2bPrice: z.preprocess(
    (val) => (typeof val === "number" && isNaN(val)) ? undefined : val,
    z.number().positive("B2B price must be positive").max(999999.99, "B2B price cannot exceed 999,999.99").optional()
  ),
  minOrderQty: z.preprocess(
    (val) => (typeof val === "number" && isNaN(val)) ? undefined : val,
    z.number().int("Min order qty must be a whole number").min(1).max(100000).optional()
  ),
  stock: z.preprocess(
    (val) => (typeof val === "number" && isNaN(val)) ? 0 : val,
    z.number({ error: "Stock must be a number" }).int("Stock must be a whole number").min(0, "Stock cannot be negative").max(1000000, "Stock cannot exceed 1,000,000")
  ),
  image: z.string().trim().max(2048).optional().or(z.literal("")),
  status: z.enum(EnumStatus, {
    message: "Status must be active, inactive, or out_of_stock",
  }),
  categoryId: z.string().optional(),
  unitId: z.string().optional(),
  /** GST rate ID from the dropdown — stored as string from form select, coerced to number on submit */
  gstRateId: z.string().optional(),
  /** Vendor ID from the dropdown */
  vendorId: z.string().optional(),
})
export type ProductFormValues = z.infer<typeof ProductFormSchema>

// ─── Customer Form (password optional for edits) ───
export const CustomerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(NAME_REGEX, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least one uppercase, one lowercase, one number, and one special character (@$!%*?&#)"
    )
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Invalid phone number (e.g. +1234567890)")
    .optional()
    .or(z.literal("")),
  customerType: z.enum(EnumCustomerType, {
    message: "Customer type must be b2c or b2b",
  }).default(EnumCustomerType.B2C),
})

export const VerifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type CustomerFormValues = z.infer<typeof CustomerFormSchema>

// ─── Order Update Form ───
export const OrderUpdateFormSchema = z.object({
  status: z.enum(EnumOrderStatus, {
    message: "Status must be pending, confirmed, shipped, delivered, or cancelled",
  }),
})
export type OrderUpdateFormValues = z.infer<typeof OrderUpdateFormSchema>

// ─── Payment Update Form ───
export const PaymentUpdateFormSchema = z.object({
  transactionId: z
    .string()
    .trim()
    .min(3, "Transaction ID must be at least 3 characters")
    .max(100, "Transaction ID must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  paymentStatus: z.enum(EnumTransactionStatus, {
    message: "Payment status must be pending, completed, failed, or refunded",
  }),
})

export const SendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
});
