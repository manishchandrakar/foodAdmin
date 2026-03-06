"use client";

import { useState } from "react";
import {
  useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit, useUnitForm,
} from "@/hooks/useUnits";
import useAuthStore from "@/store/authStore";
import type { IUnit } from "@/types/entities";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import {

  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import PageSkeleton from "@/components/common/PageSkeleton";
import { UnitsColumns } from "@/utils/constants";
import { formatDate } from "@/utils/dateUtils";



const UnitsPage = () => {
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const { data: units, isLoading } = useUnits();
  const { mutate: create, isPending: isCreating } = useCreateUnit();
  const { mutate: update, isPending: isUpdating } = useUpdateUnit();
  const { mutate: remove } = useDeleteUnit();

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { form, resetForCreate, resetForEdit } = useUnitForm();
  const { register, handleSubmit, formState: { errors } } = form;

  const openCreate = () => { setEditingId(null); resetForCreate(); setOpen(true); };
  const openEdit = (unit: IUnit) => { setEditingId(unit.id); resetForEdit(unit); setOpen(true); };
  const onSubmit = (data: { name: string; symbol: string }) => {
    if (editingId) update({ id: editingId, payload: data }, { onSuccess: () => setOpen(false) });
    else create(data, { onSuccess: () => setOpen(false) });
  };
  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (unit: IUnit, key: string) => {
    switch (key) {
      case "id":        return <span>{unit.id}</span>;
      case "name":      return <span>{unit.name}</span>;
      case "symbol":    return <span>{unit.symbol}</span>;
      case "createdAt": return <span>{formatDate(unit.createdAt) ?? "—"}</span>;
      case "actions":
        return isAdmin ? (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(unit)}>
              <FaEdit size={12} />
            </CustomButton>
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(unit.id)}>
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
        <h1 className="text-2xl font-bold text-slateGray">Units</h1>
        {isAdmin && (
          <CustomButton leftIcon={<FaPlus size={12} />} text="Add Unit" onClick={openCreate} />
        )}
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Units table"
          classNames={{
            table:  ["bg-white"],
            thead:  ["bg-gray-50"],
            th:     ["py-3", "px-4", "text-left", "text-xs", "font-semibold", "text-slateGray", "uppercase", "tracking-wide"],
            tbody:  ["divide-y", "divide-gray-100"],
            td:     ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr:     ["hover:bg-gray-50", "transition-colors"],
          }}
        >
          <TableHeader columns={UnitsColumns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={units ?? []} emptyContent="No units found.">
            {(unit) => (
              <TableRow key={unit.id}>
                {(columnKey) => <TableCell>{renderCell(unit, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editingId ? "Edit Unit" : "Add Unit"}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isCreating || isUpdating}
        submitLabel={editingId ? "Update" : "Create"}
        asForm
      >
        <CustomInput label="Name" placeholder="e.g., Kilogram" isRequired
          isInvalid={!!errors.name} errorMessage={errors.name?.message} {...register("name")} />
        <CustomInput label="Symbol" placeholder="e.g., kg" isRequired
          isInvalid={!!errors.symbol} errorMessage={errors.symbol?.message} {...register("symbol")} />
      </FormModal>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="Unit" />
    </div>
  );
};

export default UnitsPage;
