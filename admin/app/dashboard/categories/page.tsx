"use client";

import { useState } from "react";
import {
  useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useCategoryForm,
} from "@/hooks/useCategories";
import useAuthStore from "@/store/authStore";
import type { ICategoryResponse } from "@/types/api";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import CustomTextarea from "@/components/custom/CustomTextarea";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import ImageUpload from "@/components/ImageUpload";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { CategoryFormValues } from "@/lib/schemas";
import PageSkeleton from "@/components/common/PageSkeleton";
import { columns } from "@/utils/constants";
import { formatDate } from "@/utils/dateUtils";



const CategoriesPage = () => {
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const { data: categories, isLoading } = useCategories();
  const { mutate: create, isPending: isCreating } = useCreateCategory();
  const { mutate: update, isPending: isUpdating } = useUpdateCategory();
  const { mutate: remove } = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { form, resetForCreate, resetForEdit } = useCategoryForm();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const openCreate = () => { setEditingId(null); resetForCreate(); setOpen(true); };
  const openEdit = (cat: ICategoryResponse) => { setEditingId(cat.id); resetForEdit(cat); setOpen(true); };
  const onSubmit = (data: CategoryFormValues) => {
    const payload = { ...data, description: data.description || undefined, image: data.image || undefined };
    if (editingId) update({ id: editingId, payload }, { onSuccess: () => setOpen(false) });
    else create(payload, { onSuccess: () => setOpen(false) });
  };
  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (cat: ICategoryResponse, key: string) => {
    switch (key) {
      case "id":          return <span>{cat.id}</span>;
      case "name":        return <span>{cat.name}</span>;
      case "description": return <span className="max-w-xs truncate block">{cat.description || "—"}</span>;
      case "createdAt":   return <span>{formatDate(cat.createdAt) ?? "—"}</span>;
      case "actions":
        return isAdmin ? (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(cat)}>
              <FaEdit size={12} />
            </CustomButton>
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(cat.id)}>
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
        <h1 className="text-2xl font-bold text-slateGray">Categories</h1>
        {isAdmin && (
          <CustomButton leftIcon={<FaPlus size={12} />} text="Add Category" onClick={openCreate} />
        )}
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Categories table"
          classNames={{
            table:  ["bg-white"],
            thead:  ["bg-gray-50"],
            th:     ["py-3", "px-4", "text-left", "text-xs", "font-semibold", "text-slateGray", "uppercase", "tracking-wide"],
            tbody:  ["divide-y", "divide-gray-100"],
            td:     ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr:     ["hover:bg-gray-50", "transition-colors"],
          }}
        >
          <TableHeader columns={columns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={categories ?? []} emptyContent="No categories found.">
            {(cat) => (
              <TableRow key={cat.id}>
                {(columnKey) => <TableCell>{renderCell(cat, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editingId ? "Edit Category" : "Add Category"}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isCreating || isUpdating}
        submitLabel={editingId ? "Update" : "Create"}
        asForm
      >
        <CustomInput label="Name" isRequired
          isInvalid={!!errors.name} errorMessage={errors.name?.message} {...register("name")} />
        <CustomTextarea label="Description"
          isInvalid={!!errors.description} errorMessage={errors.description?.message} {...register("description")} />
        <ImageUpload value={watch("image")} onChange={(url) => setValue("image", url)} />
      </FormModal>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="Category" />
    </div>
  );
};

export default CategoriesPage;
