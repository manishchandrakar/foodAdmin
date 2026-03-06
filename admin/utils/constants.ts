import { ColumnDef } from "@/components/custom/Table";
import { ISelectDropdownOptions } from "@/types/entities";
import {
  EnumUserRole,
  EnumOrderStatus,
  EnumTransactionStatus,
  EnumStatus,
  EnumPaymentMethod,
  EnumCouponStatus,
  EnumVendorStatus,
  EnumCustomerType,
} from "@/types/enum";

export const statusOptions: ISelectDropdownOptions<EnumOrderStatus>[] = [
  { label: "Pending",   value: EnumOrderStatus.PENDING },
  { label: "Confirmed", value: EnumOrderStatus.CONFIRMED },
  { label: "Shipped",   value: EnumOrderStatus.SHIPPED },
  { label: "Delivered", value: EnumOrderStatus.DELIVERED },
  { label: "Cancelled", value: EnumOrderStatus.CANCELLED },
];

export const paymentMethodOptions: ISelectDropdownOptions<EnumPaymentMethod>[] = [
  { label: "Cash",        value: EnumPaymentMethod.CASH },
  { label: "Card",        value: EnumPaymentMethod.CARD },
  { label: "UPI",         value: EnumPaymentMethod.UPI },
  { label: "Net Banking", value: EnumPaymentMethod.NETBANKING },
  { label: "Wallet",      value: EnumPaymentMethod.WALLET },
];

export const paymentStatusOptions: ISelectDropdownOptions<EnumTransactionStatus>[] = [
  { label: "Pending",   value: EnumTransactionStatus.PENDING },
  { label: "Completed", value: EnumTransactionStatus.COMPLETED },
  { label: "Failed",    value: EnumTransactionStatus.FAILED },
  { label: "Refunded",  value: EnumTransactionStatus.REFUNDED },
];

export const productStatusOptions: ISelectDropdownOptions<EnumStatus>[] = [
  { label: "Active",       value: EnumStatus.ACTIVE },
  { label: "Inactive",     value: EnumStatus.INACTIVE },
  { label: "Out of Stock", value: EnumStatus.OUT_OF_STOCK },
];

export const roleOptions: ISelectDropdownOptions<EnumUserRole>[] = [
  { label: "Sub Admin", value: EnumUserRole.SUB_ADMIN },
  { label: "Admin",     value: EnumUserRole.ADMIN },
];

export const vendorStatusOptions: ISelectDropdownOptions<EnumVendorStatus>[] = [
  { label: "Active",   value: EnumVendorStatus.ACTIVE },
  { label: "Inactive", value: EnumVendorStatus.INACTIVE },
  { label: "Pending",  value: EnumVendorStatus.PENDING },
];

export const customerTypeOptions: ISelectDropdownOptions<EnumCustomerType>[] = [
  { label: "B2C (Retail)",    value: EnumCustomerType.B2C },
  { label: "B2B (Wholesale)", value: EnumCustomerType.B2B },
];

export const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const statusColor: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped:   "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export const vendorStatusColor: Record<string, string> = {
  active:   "bg-green-100 text-green-700",
  inactive: "bg-zinc-100 text-zinc-600",
  pending:  "bg-yellow-100 text-yellow-700",
};

export const customerTypeColor: Record<string, string> = {
  b2c: "bg-blue-100 text-blue-700",
  b2b: "bg-purple-100 text-purple-700",
};

export const ADMIN_ROLES = [EnumUserRole.ADMIN];
export const ALLOWED_ROLES = [EnumUserRole.ADMIN, EnumUserRole.SUB_ADMIN];
export const ADMIN_ONLY_HREFS = [
  "/dashboard/payments",
  "/dashboard/reviews",
  "/dashboard/admins",
];

export const roleColor: Record<string, string> = {
  admin:    "bg-purple-100 text-purple-700",
  subAdmin: "bg-blue-100 text-blue-700",
  customer: "bg-green-100 text-green-700",
};


export const columns: ColumnDef[] = [
  { uid: "id",      name: "#" },
  { uid: "name",    name: "Name" },
  { uid: "email",   name: "Email" },
  { uid: "phone",   name: "Phone" },
  { uid: "role",    name: "Role" },
  { uid: "actions", name: "" },
];

export const Categories: ColumnDef[] = [
  { uid: "id",          name: "#" },
  { uid: "name",        name: "Name" },
  { uid: "description", name: "Description" },
  { uid: "createdAt",   name: "Created" },
  { uid: "actions",     name: "" },
];

export const couponStatusOptions: ISelectDropdownOptions<EnumCouponStatus>[] = [
  { label: "Active",   value: EnumCouponStatus.ACTIVE },
  { label: "Inactive", value: EnumCouponStatus.INACTIVE },
  { label: "Expired",  value: EnumCouponStatus.EXPIRED },
];

export const couponColumns: ColumnDef[] = [
  { uid: "id",              name: "#" },
  { uid: "code",            name: "Code" },
  { uid: "discountPercent", name: "Discount" },
  { uid: "expiryDate",      name: "Expiry" },
  { uid: "status",          name: "Status" },
  { uid: "actions",         name: "" },
];

export const customerColumns: ColumnDef[] = [
  { uid: "id",           name: "#" },
  { uid: "name",         name: "Name" },
  { uid: "email",        name: "Email" },
  { uid: "phone",        name: "Phone" },
  { uid: "customerType", name: "Type" },
  { uid: "actions",      name: "" },
];

export const OrdersColumns: ColumnDef[] = [
  { uid: "id",            name: "Order" },
  { uid: "user",          name: "Customer" },
  { uid: "totalAmount",   name: "Total" },
  { uid: "paymentMethod", name: "Payment" },
  { uid: "status",        name: "Status" },
  { uid: "createdAt",     name: "Date" },
  { uid: "actions",       name: "" },
];

export const GSTColumns: ColumnDef[] = [
  { uid: "id",         name: "#" },
  { uid: "name",       name: "Name" },
  { uid: "percentage", name: "Percentage" },
  { uid: "createdAt",  name: "Created" },
  { uid: "actions",    name: "" },
];

export const PaymentsColumns: ColumnDef[] = [
  { uid: "id",            name: "#" },
  { uid: "order",         name: "Order" },
  { uid: "customer",      name: "Customer" },
  { uid: "amount",        name: "Amount" },
  { uid: "method",        name: "Method" },
  { uid: "transactionId", name: "Transaction ID" },
  { uid: "status",        name: "Status" },
  { uid: "paidAt",        name: "Paid At" },
  { uid: "actions",       name: "" },
];


export const ProductColumns: ColumnDef[] = [
  { uid: "id",       name: "#" },
  { uid: "name",     name: "Name" },
  { uid: "vendor",   name: "Vendor" },
  { uid: "mrp",      name: "MRP" },
  { uid: "price",    name: "Selling Price" },
  { uid: "b2bPrice", name: "B2B Price" },
  { uid: "gst",      name: "GST" },
  { uid: "stock",    name: "Stock" },
  { uid: "unit",     name: "Unit" },
  { uid: "category", name: "Category" },
  { uid: "status",   name: "Status" },
  { uid: "actions",  name: "" },
];

export const VendorColumns: ColumnDef[] = [
  { uid: "id",       name: "#" },
  { uid: "name",     name: "Name" },
  { uid: "email",    name: "Email" },
  { uid: "phone",    name: "Phone" },
  { uid: "gstin",    name: "GSTIN" },
  { uid: "products", name: "Products" },
  { uid: "status",   name: "Status" },
  { uid: "actions",  name: "" },
];

export const ReviewColumns: ColumnDef[] = [
  { uid: "id",        name: "#" },
  { uid: "user",      name: "User" },
  { uid: "product",   name: "Product" },
  { uid: "rating",    name: "Rating" },
  { uid: "comment",   name: "Comment" },
  { uid: "createdAt", name: "Date" },
  { uid: "actions",   name: "" },
];

export const UnitsColumns: ColumnDef[] = [
  { uid: "id",        name: "#" },
  { uid: "name",      name: "Name" },
  { uid: "symbol",    name: "Symbol" },
  { uid: "createdAt", name: "Created" },
  { uid: "actions",   name: "" },
];

export const couponStatusColor: Record<string, string> = {
  active:   "bg-green-100 text-green-700",
  inactive: "bg-zinc-100 text-zinc-600",
  expired:  "bg-red-100 text-red-700",
};

export const ratingColor = (rating: number) => {
  if (rating >= 4) return "bg-green-100 text-green-700";
  if (rating >= 3) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};
