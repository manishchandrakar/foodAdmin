"use client";

import { useState } from "react";
import {
  useGstRates, useCreateGstRate, useUpdateGstRate, useDeleteGstRate, useGstRateForm,
} from "@/hooks/useGstRates";
import useAuthStore from "@/store/authStore";
import type { IGstRateResponse } from "@/types/api";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import PageSkeleton from "@/components/common/PageSkeleton";
import { GSTColumns } from "@/utils/constants";
import { formatDate } from "@/utils/dateUtils";


const GstRatesPage = () => {
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const { data: gstRates, isLoading } = useGstRates();
  const { mutate: create, isPending: isCreating } = useCreateGstRate();
  const { mutate: update, isPending: isUpdating } = useUpdateGstRate();
  const { mutate: remove } = useDeleteGstRate();

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { form, resetForCreate, resetForEdit } = useGstRateForm();
  const { register, handleSubmit, formState: { errors } } = form;

  const openCreate = () => { setEditingId(null); resetForCreate(); setOpen(true); };
  const openEdit = (g: IGstRateResponse) => { setEditingId(g.id); resetForEdit(g); setOpen(true); };
  const onSubmit = (data: { name: string; percentage: number }) => {
    if (editingId) update({ id: editingId, payload: data }, { onSuccess: () => setOpen(false) });
    else create(data, { onSuccess: () => setOpen(false) });
  };
  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (g: IGstRateResponse, key: string) => {
    switch (key) {
      case "id":         return <span>{g.id}</span>;
      case "name":       return <span>{g.name}</span>;
      case "percentage": return <span>{g.percentage}%</span>;
      case "createdAt":  return <span>{formatDate(g.createdAt) ?? "—"}</span>;
      case "actions":
        return isAdmin ? (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(g)}>
              <FaEdit size={12} />
            </CustomButton>
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(g.id)}>
              <FaTrash size={12} className="text-red-500" />
            </CustomButton>
          </div>
        ) : <span />;
      default: return <span>—</span>;
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slateGray">GST Rates</h1>
        {isAdmin && (
          <CustomButton leftIcon={<FaPlus size={12} />} text="Add GST Rate" onClick={openCreate} />
        )}
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <Table
          aria-label="GST Rates table"
          classNames={{
            table:  ["bg-white"],
            thead:  ["bg-gray-50"],
            th:     ["py-3", "px-4", "text-left", "text-xs", "font-semibold", "text-slateGray", "uppercase", "tracking-wide"],
            tbody:  ["divide-y", "divide-gray-100"],
            td:     ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr:     ["hover:bg-gray-50", "transition-colors"],
          }}
        >
          <TableHeader columns={GSTColumns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={gstRates ?? []} emptyContent="No GST rates found.">
            {(g) => (
              <TableRow key={g.id}>
                {(columnKey) => <TableCell>{renderCell(g, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editingId ? "Edit GST Rate" : "Add GST Rate"}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isCreating || isUpdating}
        submitLabel={editingId ? "Update" : "Create"}
        asForm
      >
        <CustomInput label="Name" placeholder="e.g., Standard GST" isRequired
          isInvalid={!!errors.name} errorMessage={errors.name?.message} {...register("name")} />
        <CustomInput label="Percentage (%)" placeholder="e.g., 18" type="number" isRequired
          isInvalid={!!errors.percentage} errorMessage={errors.percentage?.message}
          {...register("percentage", { valueAsNumber: true })} />
      </FormModal>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="GST Rate" />
    </div>
  );
};

export default GstRatesPage;
