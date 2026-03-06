"use client";

import { useMemo, useState } from "react";
import {
  useCarts,
  useCreateCart,
  useDeleteCart,
  useCheckoutCart,
} from "@/hooks/useCart";
import { useUsers } from "@/hooks/useUsers";
import { useProducts } from "@/hooks/useProducts";
import { CartCreateSchema, CartCheckoutSchema } from "@/lib/schemas";
import type { ICart, ISelectDropdownOptions } from "@/types/entities";
import { EnumUserRole, EnumStatus, EnumCartStatus } from "@/types/enum";
import CustomSingleSelectInput from "@/components/SingleDropdown";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, type ColumnDef,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { FaPlus, FaTrash, FaShoppingCart, FaCashRegister, FaRupeeSign, FaEye } from "react-icons/fa";
import { paymentMethodOptions } from "@/utils/constants";
import PageSkeleton from "@/components/common/PageSkeleton";
import type { ICartLineItem } from "@/types/commonTypes";

 type FormItem = ICartLineItem & { readonly _key: string };
interface LocalCreateFormState { userId: string; items: FormItem[]; }

interface IFormErrors {
  userId?: string;
  items?: string;
  itemErrors?: Record<number, { productId?: string; quantity?: string; price?: string }>;
}

interface CheckoutErrors {
  paymentMethod?: string;
  address?: string;
  couponCode?: string;
}

const cartStatusColor: Record<string, string> = {
  active:      "bg-green-100 text-green-700",
  checked_out: "bg-blue-100 text-blue-700",
  abandoned:   "bg-zinc-100 text-zinc-600",
};
;


const columns: ColumnDef[] = [
  { uid: 'id',        name: '#' },
  { uid: 'user',      name: 'Customer' },
  { uid: 'items',     name: 'Items' },
  { uid: 'total',     name: 'Total' },
  { uid: 'status',    name: 'Status' },
  { uid: 'createdAt', name: 'Created' },
  { uid: 'actions',   name: '' },
];

const createEmptyForm = (): LocalCreateFormState => ({
  userId: "",
  items: [{ productId: "", quantity: 1, price: 0, _key: crypto.randomUUID() }],
});

const ErrorText = ({ message }: { message?: string }) =>
  message ? <p className="text-red-500 text-xs font-semibold mt-1">{message}</p> : null;

const CartPage = () => {
  const { data: carts, isLoading } = useCarts();
  const { mutate: createCart, isPending: isCreating } = useCreateCart();
  const { mutate: deleteCart } = useDeleteCart();
  const { mutate: checkout, isPending: isCheckingOut } = useCheckoutCart();

  const { data: users } = useUsers();
  const { data: products } = useProducts();

  const customers = useMemo(
    () => users?.filter((u) => u.role === EnumUserRole.CUSTOMER) ?? [],
    [users]
  );
  const activeProducts = useMemo(
    () => products?.filter((p) => p.status === EnumStatus.ACTIVE) ?? [],
    [products]
  );

  const customerOptions: ISelectDropdownOptions[] = useMemo(
    () => customers.map((c) => ({ label: `${c.name} (${c.email})`, value: String(c.id) })),
    [customers]
  );
  const productOptions: ISelectDropdownOptions[] = useMemo(
    () => activeProducts.map((p) => ({ label: `${p.name} (${Number(p.price).toFixed(2)})`, value: String(p.id) })),
    [activeProducts]
  );

  // ─── Create Cart State ───
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<LocalCreateFormState>(createEmptyForm());
  const [errors, setErrors] = useState<IFormErrors>({});

  // ─── Delete State ───
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ─── View Cart State ───
  const [viewCart, setViewCart] = useState<ICart | null>(null);

  // ─── Checkout State ───
  const [checkoutCart, setCheckoutCart] = useState<ICart | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({ paymentMethod: "", address: "", couponCode: "" });
  const [checkoutErrors, setCheckoutErrors] = useState<CheckoutErrors>({});

  // ─── Helpers ───
  const getCartTotal = (cart: ICart) =>
    cart.cartItems?.reduce((sum, item) => sum + item.quantity * Number(item.price), 0) ?? 0;

  const totalAmount = createForm.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const resetCreateForm = () => {
    setCreateForm(createEmptyForm());
    setErrors({});
  };

  const updateItem = (index: number, field: keyof ICartLineItem, value: string | number) => {
    setCreateForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      if (field === "productId" && value !== "") {
        const product = activeProducts.find((p) => String(p.id) === value);
        if (product) items[index].price = product.price;
      }
      return { ...prev, items };
    });
    setErrors((prev) => {
      if (!prev.itemErrors?.[index]) return prev;
      const itemErrors = { ...prev.itemErrors };
      delete itemErrors[index];
      return { ...prev, itemErrors };
    });
  };

  const addItem = () => {
    setCreateForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, price: 0, _key: crypto.randomUUID() }],
    }));
  };

  const removeItem = (index: number) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleCreate = () => {
    const payload = {
      userId: createForm.userId ? Number(createForm.userId) : 0,
      items: createForm.items.map((item) => ({
        productId: item.productId ? Number(item.productId) : 0,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    const result = CartCreateSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: IFormErrors = {};
      const itemErrors: IFormErrors["itemErrors"] = {};
      for (const issue of result.error.issues) {
        const path = issue.path;
        if (path[0] === "userId") fieldErrors.userId = issue.message;
        else if (path[0] === "items" && path.length === 1) fieldErrors.items = issue.message;
        else if (path[0] === "items" && typeof path[1] === "number") {
          const idx = path[1];
          const field = path[2] as string;
          if (!itemErrors[idx]) itemErrors[idx] = {};
          itemErrors[idx][field as keyof (typeof itemErrors)[number]] = issue.message;
        }
      }
      fieldErrors.itemErrors = itemErrors;
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    createCart(payload, {
      onSuccess: () => {
        setCreateOpen(false);
        resetCreateForm();
      },
    });
  };

  const handleCheckout = () => {
    if (!checkoutCart) return;

    const payload = {
      paymentMethod: checkoutForm.paymentMethod || undefined,
      address: checkoutForm.address,
      couponCode: checkoutForm.couponCode.trim() || undefined,
    };

    const result = CartCheckoutSchema.safeParse(payload);
    if (!result.success) {
      const errs: CheckoutErrors = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "paymentMethod") errs.paymentMethod = issue.message;
        if (issue.path[0] === "address") errs.address = issue.message;
      }
      setCheckoutErrors(errs);
      return;
    }

    setCheckoutErrors({});
    checkout(
      { cartId: checkoutCart.id, payload },
      {
        onSuccess: () => {
          setCheckoutCart(null);
          setCheckoutForm({ paymentMethod: "", address: "", couponCode: "" });
        },
      }
    );
  };

  const confirmDelete = () => {
    if (deleteId) deleteCart(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (c: ICart, key: string) => {
    switch (key) {
      case "id":
        return <span className="font-mono">#{c.id}</span>;
      case "user":
        return <span className="font-medium">{c.user?.name || `User #${c.userId}`}</span>;
      case "items":
        return <span>{c.cartItems?.length ?? 0}</span>;
      case "total":
        return (
          <span className="inline-flex items-center gap-0.5 font-medium">
            <FaRupeeSign size={11} />{getCartTotal(c).toFixed(2)}
          </span>
        );
      case "status":
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cartStatusColor[c.status] || ""}`}>
            {c.status}
          </span>
        );
      case "createdAt":
        return <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</span>;
      case "actions":
        return (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setViewCart(c)} title="View">
              <FaEye size={12} />
            </CustomButton>
            {c.status === EnumCartStatus.ACTIVE && (
              <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setCheckoutCart(c)} title="Checkout">
                <FaCashRegister size={12} className="text-blue-500" />
              </CustomButton>
            )}
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(c.id)} title="Delete">
              <FaTrash size={12} className="text-red-500" />
            </CustomButton>
          </div>
        );
      default:
        return <span>—</span>;
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slateGray">Carts</h1>
        <CustomButton leftIcon={<FaPlus size={12} />} text="Create Cart" onClick={() => setCreateOpen(true)} />
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Carts table"
          classNames={{
            table:  ["bg-white", "dark:bg-zinc-900"],
            thead:  ["bg-gray-50", "dark:bg-zinc-800/50"],
            th:     ["py-3", "px-4", "text-left", "text-xs", "font-semibold", "text-slateGray", "uppercase", "tracking-wide"],
            tbody:  ["divide-y", "divide-gray-100", "dark:divide-zinc-800"],
            td:     ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr:     ["hover:bg-gray-50", "dark:hover:bg-zinc-800/50", "transition-colors"],
          }}
        >
          <TableHeader columns={columns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={carts ?? []} emptyContent="No carts found.">
            {(c) => (
              <TableRow key={c.id}>
                {(columnKey) => <TableCell>{renderCell(c, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Cart Dialog */}
      <Dialog open={!!viewCart} onOpenChange={() => setViewCart(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slateGray">
              <FaShoppingCart /> Cart #{viewCart?.id}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-gray-500">
              Customer: <span className="font-medium text-slateGray">{viewCart?.user?.name}</span>
            </p>
            <p className="text-sm text-gray-500">
              Status:{" "}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cartStatusColor[viewCart?.status ?? ""] || ""}`}>
                {viewCart?.status}
              </span>
            </p>
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-slateGray uppercase tracking-wide">Product</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-slateGray uppercase tracking-wide">Qty</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-slateGray uppercase tracking-wide">Price</th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-slateGray uppercase tracking-wide">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {viewCart?.cartItems?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3">{item.product?.name || `#${item.productId}`}</td>
                    <td className="py-2 px-3">{item.quantity}</td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-0.5">
                        <FaRupeeSign size={10} />{Number(item.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-0.5">
                        <FaRupeeSign size={10} />{(item.quantity * Number(item.price)).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between pt-2 border-t font-semibold text-sm">
              <span>Total</span>
              <span className="inline-flex items-center gap-0.5">
                <FaRupeeSign size={11} />{viewCart ? getCartTotal(viewCart).toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <CustomButton variant="outline" onClick={() => setViewCart(null)}>Close</CustomButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <FormModal
        open={!!checkoutCart}
        onOpenChange={(open) => {
          if (!open) {
            setCheckoutCart(null);
            setCheckoutForm({ paymentMethod: "", address: "", couponCode: "" });
            setCheckoutErrors({});
          }
        }}
        title={`Checkout Cart #${checkoutCart?.id}`}
        onSubmit={handleCheckout}
        isSubmitting={isCheckingOut}
        submitLabel="Place Order"
      >
        <p className="text-sm text-gray-500">
          Customer: <span className="font-medium text-slateGray">{checkoutCart?.user?.name}</span>
          {" — "}Items: {checkoutCart?.cartItems?.length ?? 0}
          {" — "}Total:{" "}
          <span className="inline-flex items-center gap-0.5 font-medium text-slateGray">
            <FaRupeeSign size={10} />{checkoutCart ? getCartTotal(checkoutCart).toFixed(2) : "0.00"}
          </span>
        </p>
        <CustomSingleSelectInput
          label="Payment Method"
          value={paymentMethodOptions.find((o) => o.value === checkoutForm.paymentMethod) ?? null}
          options={paymentMethodOptions}
          onChange={(selected) => {
            setCheckoutForm((prev) => ({ ...prev, paymentMethod: selected?.value ?? "" }));
            if (selected) setCheckoutErrors((prev) => ({ ...prev, paymentMethod: undefined }));
          }}
          placeholder="Select payment method"
          isRequired
          isInvalid={!!checkoutErrors.paymentMethod}
          errorMessage={checkoutErrors.paymentMethod}
        />
        <CustomInput
          label="Address"
          isRequired
          placeholder="Delivery address (min 10 characters)"
          value={checkoutForm.address}
          isInvalid={!!checkoutErrors.address}
          errorMessage={checkoutErrors.address}
          onChange={(e) => {
            setCheckoutForm((prev) => ({ ...prev, address: e.target.value }));
            if (checkoutErrors.address) setCheckoutErrors((prev) => ({ ...prev, address: undefined }));
          }}
        />
        <CustomInput
          label="Coupon Code (optional)"
          placeholder="e.g., MANGO20"
          value={checkoutForm.couponCode}
          isInvalid={!!checkoutErrors.couponCode}
          errorMessage={checkoutErrors.couponCode}
          onChange={(e) => {
            setCheckoutForm((prev) => ({ ...prev, couponCode: e.target.value.toUpperCase() }));
            if (checkoutErrors.couponCode) setCheckoutErrors((prev) => ({ ...prev, couponCode: undefined }));
          }}
        />
      </FormModal>

      {/* Create Cart Dialog */}
      <FormModal
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) resetCreateForm();
        }}
        title="Create Cart"
        onSubmit={handleCreate}
        isSubmitting={isCreating}
        submitLabel="Create Cart"
        className="sm:max-w-2xl"
      >
        <CustomSingleSelectInput
          label="Customer"
          value={customerOptions.find((o) => o.value === createForm.userId) ?? null}
          options={customerOptions}
          onChange={(selected) => {
            setCreateForm((prev) => ({ ...prev, userId: selected?.value ?? "" }));
            if (selected) setErrors((prev) => ({ ...prev, userId: undefined }));
          }}
          placeholder="Select customer"
          isRequired
          isInvalid={!!errors.userId}
          errorMessage={errors.userId}
        />

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slateGray">
              Items <span className="text-red-500">*</span>
            </p>
            <CustomButton
              type="button"
              variant="outline"
              className="h-7 text-xs px-2"
              leftIcon={<FaPlus size={10} />}
              text="Add Item"
              onClick={addItem}
            />
          </div>
          <ErrorText message={errors.items} />

          <div className="space-y-3">
            {createForm.items.map((item, idx) => {
              const itemErr = errors.itemErrors?.[idx];
              return (
                <div key={item._key} className="flex items-end gap-2">
                  <div className="flex-1">
                    <CustomSingleSelectInput
                      label={idx === 0 ? "Product" : undefined}
                      value={productOptions.find((o) => o.value === item.productId) ?? null}
                      options={productOptions}
                      onChange={(selected) => updateItem(idx, "productId", selected?.value ?? "")}
                      placeholder="Select product"
                      isInvalid={!!itemErr?.productId}
                      errorMessage={itemErr?.productId}
                    />
                  </div>
                  <div className="w-20">
                    <CustomInput
                      label={idx === 0 ? "Qty" : undefined}
                      type="number"
                      min={1}
                      value={String(item.quantity)}
                      isInvalid={!!itemErr?.quantity}
                      errorMessage={itemErr?.quantity}
                      onChange={(e) => updateItem(idx, "quantity", Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                  <div className="w-28">
                    <CustomInput
                      label={idx === 0 ? "Price" : undefined}
                      type="number"
                      min={0}
                      step="0.01"
                      value={String(item.price)}
                      isInvalid={!!itemErr?.price}
                      errorMessage={itemErr?.price}
                      onChange={(e) => updateItem(idx, "price", Number(e.target.value))}
                    />
                  </div>
                  <CustomButton
                    type="button"
                    variant="ghost"
                    className="size-7 p-0 mb-1"
                    isDisabled={createForm.items.length === 1}
                    onClick={() => removeItem(idx)}
                  >
                    <FaTrash size={12} className="text-red-500" />
                  </CustomButton>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t font-semibold text-sm">
          <span>Total</span>
          <span className="inline-flex items-center gap-0.5">
            <FaRupeeSign size={11} />{totalAmount.toFixed(2)}
          </span>
        </div>
      </FormModal>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="Cart" />
    </div>
  );
};

export default CartPage;
