"use client";

import { useState } from "react";
import {
  useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon,
} from "@/hooks/useCoupons";
import type { ICoupon } from "@/types/entities";
import { EnumCouponStatus } from "@/types/enum";
import CustomSingleSelectInput from "@/components/SingleDropdown";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import PageSkeleton from "@/components/common/PageSkeleton";
import { couponColumns, couponStatusOptions, statusColor } from "@/utils/constants";
import { formatDate } from "@/utils/dateUtils";




const initialForm = {
  code: "",
  discountPercent: "10",
  expiryDate: "",
  status: EnumCouponStatus.ACTIVE,
};

const CouponsPage = () => {
  const { data: coupons, isLoading } = useCoupons();
  const { mutate: create, isPending: isCreating } = useCreateCoupon();
  const { mutate: update, isPending: isUpdating } = useUpdateCoupon();
  const { mutate: remove } = useDeleteCoupon();

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const openCreate = () => { setEditingId(null); setForm(initialForm); setOpen(true); };
  const openEdit = (c: ICoupon) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      discountPercent: String(c.discountPercent),
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split("T")[0] : "",
      status: c.status,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    const payload = { ...form, expiryDate: form.expiryDate || undefined };
    if (editingId) update({ id: editingId, payload }, { onSuccess: () => setOpen(false) });
    else create(payload, { onSuccess: () => setOpen(false) });
  };

  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (c: ICoupon, key: string) => {
    switch (key) {
      case "id":
        return <span>{c.id}</span>;
      case "code":
        return <span className="font-mono font-medium">{c.code}</span>;
      case "discountPercent":
        return <span>{c.discountPercent}%</span>;
      case "expiryDate":
        return <span>{formatDate(c.expiryDate ?? undefined) ?? "—"}</span>;
      case "status":
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status] || ""}`}>
            {c.status}
          </span>
        );
      case "actions":
        return (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(c)}>
              <FaEdit size={12} />
            </CustomButton>
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(c.id)}>
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
        <h1 className="text-2xl font-bold text-slateGray">Coupons</h1>
        <CustomButton leftIcon={<FaPlus size={12} />} text="Add Coupon" onClick={openCreate} />
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Coupons table"
          classNames={{
            table:  ["bg-white"],
            thead:  ["bg-gray-50"],
            th:     ["py-3", "px-4", "text-left", "text-xs", "font-semibold", "text-slateGray", "uppercase", "tracking-wide"],
            tbody:  ["divide-y", "divide-gray-100"],
            td:     ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr:     ["hover:bg-gray-50", "transition-colors"],
          }}
        >
          <TableHeader columns={couponColumns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={coupons ?? []} emptyContent="No coupons found.">
            {(c) => (
              <TableRow key={c.id}>
                {(columnKey) => <TableCell>{renderCell(c, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editingId ? "Edit Coupon" : "Add Coupon"}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
        submitLabel={editingId ? "Update" : "Create"}
      >
        <CustomInput label="Code" placeholder="e.g. SAVE20" value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
        <div className="grid grid-cols-2 gap-4">
          <CustomInput label="Discount %" type="number" min={1} max={100} value={form.discountPercent}
            onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
          <CustomInput label="Expiry Date" type="date" value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
        </div>
        <CustomSingleSelectInput
          label="Status"
          value={couponStatusOptions.find((o) => o.value === form.status) ?? null}
          options={couponStatusOptions}
          onChange={(selected) => { if (selected) setForm({ ...form, status: selected.value }); }}
          isClearable={false}
          placeholder="Select status"
        />
      </FormModal>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="Coupon" />
    </div>
  );
};

export default CouponsPage;
