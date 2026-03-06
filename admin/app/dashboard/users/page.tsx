"use client";

import { useState } from "react";
import {
  useUsers, useCreateUser, useUpdateUser, useDeleteUser,
} from "@/hooks/useUsers";
import type { IUser } from "@/types/entities";
import { EnumUserRole } from "@/types/enum";
import CustomSingleSelectInput from "@/components/SingleDropdown";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import CustomTextarea from "@/components/custom/CustomTextarea";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import PageSkeleton from "@/components/common/PageSkeleton";
import { columns, roleColor, roleOptions } from "@/utils/constants";


const initialForm = {
  name: "", email: "", description: "", password: "", phone: "",
  role: EnumUserRole.SUB_ADMIN,
};

const UsersPage = () => {
  const { data: users, isLoading } = useUsers();
  const { mutate: create, isPending: isCreating } = useCreateUser();
  const { mutate: update, isPending: isUpdating } = useUpdateUser();
  const { mutate: remove } = useDeleteUser();

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const openCreate = () => { setEditingId(null); setForm(initialForm); setOpen(true); };
  const openEdit = (u: IUser) => {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, description: "", password: "", phone: u.phone || "", role: u.role });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!editingId && !form.password.trim()) {
      import("@/utils/toastUtils").then(({ showErrorToast }) => {
        showErrorToast({ title: "Password required", description: "Please enter a password for the new user." });
      });
      return;
    }
    if (editingId) {
      update({ id: editingId, payload: { ...form, phone: form.phone || undefined, password: form.password || undefined } },
        { onSuccess: () => setOpen(false) });
    } else {
      create({ ...form, phone: form.phone || undefined, password: form.password },
        { onSuccess: () => setOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (u: IUser, key: string) => {
    switch (key) {
      case "id":    return <span>{u.id}</span>;
      case "name":  return <span>{u.name}</span>;
      case "email": return <span>{u.email}</span>;
      case "phone": return <span>{u.phone || "—"}</span>;
      case "role":
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor[u.role] || "bg-gray-100 text-gray-600"}`}>
            {u.role}
          </span>
        );
      case "actions":
        return (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(u)}>
              <FaEdit size={12} />
            </CustomButton>
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(u.id)}>
              <FaTrash size={12} className="text-red-500" />
            </CustomButton>
          </div>
        );
      default: return <span>—</span>;
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slateGray">Users</h1>
        <CustomButton leftIcon={<FaPlus size={12} />} text="Add User" onClick={openCreate} />
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Users table"
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
          <TableBody items={users ?? []} emptyContent="No users found.">
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
        title={editingId ? "Edit User" : "Add User"}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
        submitLabel={editingId ? "Update" : "Create"}
      >
        <CustomInput label="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <CustomInput label="Email" type="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <CustomTextarea label="Description" value={form.description} rows={3}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <CustomInput
          label={editingId ? "New Password (leave blank to keep)" : "Password"}
          isPassword value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <CustomInput label="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <CustomSingleSelectInput
            label="Role"
            value={roleOptions.find((o) => o.value === form.role) ?? null}
            options={roleOptions}
            onChange={(selected) => { if (selected) setForm({ ...form, role: selected.value }); }}
            isClearable={false}
            placeholder="Select role"
          />
        </div>
      </FormModal>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="User" />
    </div>
  );
};

export default UsersPage;
