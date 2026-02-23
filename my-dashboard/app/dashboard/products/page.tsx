"use client";

import { useMemo, useState } from "react";
import {
  useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useProductForm,
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useUnits } from "@/hooks/useUnits";
import { useGstRates } from "@/hooks/useGstRates";
import useAuthStore from "@/store/authStore";
import type { ISelectDropdownOptions } from "@/types/entities";
import type { IProductResponse } from "@/types/api";
import type { ProductFormValues } from "@/lib/schemas";
import CustomSingleSelectInput from "@/components/SingleDropdown";
import ImageUpload from "@/components/ImageUpload";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import CustomTextarea from "@/components/custom/CustomTextarea";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, type ColumnDef,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { formatNumberToRupees } from "@/utils/utils";
import { ProductColumns, productStatusOptions } from "@/utils/constants";
import PageSkeleton from "@/components/common/PageSkeleton";

const calcGst = (price: number, gstPct: number) => {
  const base = price / (1 + gstPct / 100);
  return { base, gstAmount: price - base };
};

const statusColor: Record<string, string> = {
  active:       "bg-green-100 text-green-700",
  inactive:     "bg-zinc-100 text-zinc-600",
  out_of_stock: "bg-red-100 text-red-700",
};



const ProductsPage = () => {
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const { data: units } = useUnits();
  const { data: gstRates } = useGstRates();
  const { mutate: create, isPending: isCreating } = useCreateProduct();
  const { mutate: update, isPending: isUpdating } = useUpdateProduct();
  const { mutate: remove } = useDeleteProduct();

  const { form, resetForCreate, resetForEdit } = useProductForm();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const categoryOptions: ISelectDropdownOptions[] = useMemo(
    () => categories?.map((c) => ({ label: c.name, value: String(c.id) })) ?? [], [categories]);
  const unitOptions: ISelectDropdownOptions[] = useMemo(
    () => units?.map((u) => ({ label: `${u.name} (${u.symbol})`, value: String(u.id) })) ?? [], [units]);
  const gstRateOptions: ISelectDropdownOptions[] = useMemo(
    () => gstRates?.map((g) => ({ label: `${g.name} (${g.percentage}%)`, value: String(g.id) })) ?? [], [gstRates]);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openCreate = () => { setEditingId(null); resetForCreate(); setOpen(true); };
  const openEdit = (p: IProductResponse) => { setEditingId(p.id); resetForEdit(p); setOpen(true); };
  const onSubmit = (data: ProductFormValues) => {
    const payload = {
      ...data,
      mrp: data.mrp || undefined,
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
      unitId: data.unitId ? Number(data.unitId) : undefined,
      gstRateId: data.gstRateId ? Number(data.gstRateId) : undefined,
      image: data.image || undefined,
    };
    if (editingId) update({ id: editingId, payload }, { onSuccess: () => setOpen(false) });
    else create(payload, { onSuccess: () => setOpen(false) });
  };
  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const watchedPrice = watch("price") ?? 0;
  const watchedGstRateId = watch("gstRateId");
  const selectedGstRate = gstRates?.find((g) => String(g.id) === watchedGstRateId);
  const watchedGstPct = selectedGstRate?.percentage ?? 0;
  const { base: formBase, gstAmount: formGstAmount } = calcGst(watchedPrice, watchedGstPct);

  const renderCell = (p: IProductResponse, key: string) => {
    switch (key) {
      case "id":
        return <span>{p.id}</span>;
      case "name":
        return <span className="font-medium">{p.name}</span>;
      case "mrp":
        return p.mrp && p.mrp > p.price
          ? <span className="line-through text-gray-400 text-xs">{formatNumberToRupees(p.mrp)}</span>
          : <span>—</span>;
      case "price": {
        const gstPct = p.gstRate?.percentage ?? 0;
        const { base, gstAmount } = calcGst(p.price, gstPct);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{formatNumberToRupees(p.price)}</span>
            {gstPct > 0 && (
              <span className="text-[11px] text-gray-400">
                Base {formatNumberToRupees(base)} + GST {formatNumberToRupees(gstAmount)}
              </span>
            )}
          </div>
        );
      }
      case "gst":
        return p.gstRate
          ? <span className="px-1.5 py-0.5 border border-lightGray rounded text-xs">{p.gstRate.name} ({p.gstRate.percentage}%)</span>
          : <span>—</span>;
      case "stock":
        return <span>{p.stock}</span>;
      case "unit":
        return <span>{p.unit ? `${p.unit.name} (${p.unit.symbol})` : "—"}</span>;
      case "category":
        return <span>{p.category?.name || "—"}</span>;
      case "status":
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[p.status] || ""}`}>
            {p.status}
          </span>
        );
      case "actions":
        return isAdmin ? (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(p)}>
              <FaEdit size={12} />
            </CustomButton>
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(p.id)}>
              <FaTrash size={12} className="text-red-500" />
            </CustomButton>
          </div>
        ) : <span />;
      default:
        return <span>—</span>;
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slateGray">Products</h1>
        {isAdmin && (
          <CustomButton leftIcon={<FaPlus size={12} />} text="Add Product" onClick={openCreate} />
        )}
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Products table"
          classNames={{
            table:  ["bg-white"],
            thead:  ["bg-gray-50"],
            th:     ["py-3", "px-4", "text-left", "text-xs", "font-semibold", "text-slateGray", "uppercase", "tracking-wide"],
            tbody:  ["divide-y", "divide-gray-100"],
            td:     ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr:     ["hover:bg-gray-50", "transition-colors"],
          }}
        >
          <TableHeader columns={ProductColumns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={products ?? []} emptyContent="No products found.">
            {(p) => (
              <TableRow key={p.id}>
                {(columnKey) => <TableCell>{renderCell(p, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editingId ? "Edit Product" : "Add Product"}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isCreating || isUpdating}
        submitLabel={editingId ? "Update" : "Create"}
        asForm
      >
        <CustomInput label="Name" isRequired
          isInvalid={!!errors.name} errorMessage={errors.name?.message} {...register("name")} />
        <CustomTextarea label="Description" isRequired
          isInvalid={!!errors.description} errorMessage={errors.description?.message} {...register("description")} />

        <div className="grid grid-cols-2 gap-4">
          <CustomInput label="MRP (optional)" type="number" step="0.01" min={0}
            isInvalid={!!errors.mrp} errorMessage={errors.mrp?.message}
            {...register("mrp", { valueAsNumber: true })} />
          <CustomInput label="Selling Price (incl. GST)" type="number" step="0.01" min={0} isRequired
            isInvalid={!!errors.price} errorMessage={errors.price?.message}
            {...register("price", { valueAsNumber: true })} />
        </div>

        <div>
          <CustomSingleSelectInput
            label="GST Rate"
            value={gstRateOptions.find((o) => o.value === watch("gstRateId")) ?? null}
            options={gstRateOptions}
            onChange={(selected) => setValue("gstRateId", selected?.value ?? undefined)}
            placeholder="Select GST rate (optional)"
          />
          {watchedPrice > 0 && watchedGstPct > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Base {formatNumberToRupees(formBase)} + GST ({watchedGstPct}%) {formatNumberToRupees(formGstAmount)} = {formatNumberToRupees(watchedPrice)}
            </p>
          )}
        </div>

        <CustomInput label="Stock" type="number" min={0} isRequired
          isInvalid={!!errors.stock} errorMessage={errors.stock?.message}
          {...register("stock", { valueAsNumber: true })} />

        <ImageUpload value={watch("image") ?? ""} onChange={(url) => setValue("image", url)} />

        <div className="grid grid-cols-2 gap-4">
          <CustomSingleSelectInput
            label="Status"
            value={productStatusOptions.find((o) => o.value === watch("status")) ?? null}
            options={productStatusOptions}
            onChange={(selected) => { if (selected) setValue("status", selected.value); }}
            isClearable={false}
            placeholder="Select status"
          />
          <CustomSingleSelectInput
            label="Category"
            value={categoryOptions.find((o) => o.value === watch("categoryId")) ?? null}
            options={categoryOptions}
            onChange={(selected) => setValue("categoryId", selected?.value ?? undefined)}
            placeholder="Select category"
          />
        </div>
        <CustomSingleSelectInput
          label="Unit"
          value={unitOptions.find((o) => o.value === watch("unitId")) ?? null}
          options={unitOptions}
          onChange={(selected) => setValue("unitId", selected?.value ?? undefined)}
          placeholder="Select unit"
        />
      </FormModal>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="Product" />
    </div>
  );
};

export default ProductsPage;
