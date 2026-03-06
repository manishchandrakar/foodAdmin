"use client";

import { useState } from "react";
import {
  useUsers, useCreateUser, useUpdateUser, useDeleteUser, useCustomerForm,
} from "@/hooks/useUsers";
import useAuthStore from "@/store/authStore";
import type { IUserResponse } from "@/types/api";
import type { CustomerFormValues } from "@/lib/schemas";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import CustomSingleSelectInput from "@/components/SingleDropdown";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import PageSkeleton from "@/components/common/PageSkeleton";
import { EnumCustomerType, EnumUserRole } from "@/types/enum";
import { customerColumns, customerTypeOptions, customerTypeColor } from "@/utils/constants";



const CustomersPage = () => {
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const { data: users, isLoading } = useUsers();
  const { mutate: create, isPending: isCreating } = useCreateUser();
  const { mutate: update, isPending: isUpdating } = useUpdateUser();
  const { mutate: remove } = useDeleteUser();

  const { form, resetForCreate, resetForEdit } = useCustomerForm();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const customers = users?.filter((u) => u.role === EnumUserRole.CUSTOMER) ?? [];

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openCreate = () => { setEditingId(null); resetForCreate(); setOpen(true); };
  const openEdit = (u: IUserResponse) => { setEditingId(u.id); resetForEdit(u); setOpen(true); };
  const onSubmit = (data: CustomerFormValues) => {
    const payload = {
      ...data,
      role: EnumUserRole.CUSTOMER,
      password: data.password || undefined,
      phone: data.phone || undefined,
    };
    if (editingId) update({ id: editingId, payload }, { onSuccess: () => setOpen(false) });
    else create(payload, { onSuccess: () => setOpen(false) });
  };
  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (u: IUserResponse, key: string) => {
    switch (key) {
      case "id":    return <span>{u.id}</span>;
      case "name":  return <span>{u.name}</span>;
      case "email": return <span>{u.email}</span>;
      case "phone": return <span>{u.phone || "—"}</span>;
      case "customerType":
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${customerTypeColor[u.customerType] || "bg-gray-100 text-gray-600"}`}>
            {u.customerType === EnumCustomerType.B2B ? "B2B" : "B2C"}
          </span>
        );
      case "actions":
        return isAdmin ? (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(u)}>
              <FaEdit size={12} />
            </CustomButton>
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(u.id)}>
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
        <div>
          <h1 className="text-2xl font-bold text-slateGray">Customers</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            B2C: {customers.filter((u) => u.customerType !== EnumCustomerType.B2B).length} &nbsp;|&nbsp;
            B2B: {customers.filter((u) => u.customerType === EnumCustomerType.B2B).length}
          </p>
        </div>
        {isAdmin && (
          <CustomButton leftIcon={<FaPlus size={12} />} text="Add Customer" onClick={openCreate} />
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Customers table"
          classNames={{
            table:  ["bg-white", "dark:bg-zinc-900"],
            thead:  ["bg-gray-50", "dark:bg-zinc-800/50"],
            th:     ["py-3", "px-4", "text-left", "text-xs", "font-semibold", "text-slateGray", "uppercase", "tracking-wide"],
            tbody:  ["divide-y", "divide-gray-100", "dark:divide-zinc-800"],
            td:     ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr:     ["hover:bg-gray-50", "dark:hover:bg-zinc-800/50", "transition-colors"],
          }}
        >
          <TableHeader columns={customerColumns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={customers} emptyContent="No customers found.">
            {(u) => (
              <TableRow key={u.id}>
                {(columnKey) => <TableCell>{renderCell(u, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editingId ? "Edit Customer" : "Add Customer"}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isCreating || isUpdating}
        submitLabel={editingId ? "Update" : "Create"}
        asForm
      >
        <CustomInput label="Name" isRequired
          isInvalid={!!errors.name} errorMessage={errors.name?.message} {...register("name")} />
        <CustomInput label="Email" type="email" isRequired
          isInvalid={!!errors.email} errorMessage={errors.email?.message} {...register("email")} />
        <CustomInput label={editingId ? "New Password (leave blank to keep)" : "Password"} isPassword
          isInvalid={!!errors.password} errorMessage={errors.password?.message} {...register("password")} />
        <CustomInput label="Phone"
          isInvalid={!!errors.phone} errorMessage={errors.phone?.message} {...register("phone")} />
        <CustomSingleSelectInput
          label="Customer Type"
          value={customerTypeOptions.find((o) => o.value === watch("customerType")) ?? null}
          options={customerTypeOptions}
          onChange={(selected) => {
            if (selected) setValue("customerType", selected.value);
          }}
          isClearable={false}
          placeholder="Select type"
        />
      </FormModal>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="Customer" />
    </div>
  );
};

export default CustomersPage;
