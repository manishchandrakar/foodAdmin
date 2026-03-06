"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useVendors,
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
} from "@/hooks/useVendors";
import useAuthStore from "@/store/authStore";
import type { IVendorResponse } from "@/types/api";
import { VendorFormSchema, VendorFormValues } from "@/lib/schemas";
import CustomSingleSelectInput from "@/components/SingleDropdown";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import CustomTextarea from "@/components/custom/CustomTextarea";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import PageSkeleton from "@/components/common/PageSkeleton";
import { VendorColumns, vendorStatusOptions, vendorStatusColor } from "@/utils/constants";
import { EnumVendorStatus } from "@/types/enum";

const defaultValues: VendorFormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  gstin: "",
  status: EnumVendorStatus.ACTIVE,
};

const VendorsPage = () => {
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const { data: vendors, isLoading } = useVendors();
  const { mutate: create, isPending: isCreating } = useCreateVendor();
  const { mutate: update, isPending: isUpdating } = useUpdateVendor();
  const { mutate: remove } = useDeleteVendor();

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<VendorFormValues>({
    resolver: zodResolver(VendorFormSchema) as unknown as Resolver<VendorFormValues>,
    defaultValues,
  });

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    reset(defaultValues);
    setOpen(true);
  };

  const openEdit = (v: IVendorResponse) => {
    setEditingId(v.id);
    reset({
      name: v.name,
      email: v.email,
      phone: v.phone ?? "",
      address: v.address ?? "",
      gstin: v.gstin ?? "",
      status: v.status,
    });
    setOpen(true);
  };

  const onSubmit = (data: VendorFormValues) => {
    const payload = {
      ...data,
      phone: data.phone || undefined,
      address: data.address || undefined,
      gstin: data.gstin || undefined,
    };
    if (editingId) {
      update({ id: editingId, payload }, { onSuccess: () => setOpen(false) });
    } else {
      create(payload, { onSuccess: () => setOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (v: IVendorResponse, key: string) => {
    switch (key) {
      case "id":
        return <span>{v.id}</span>;
      case "name":
        return <span className="font-medium">{v.name}</span>;
      case "email":
        return <span>{v.email}</span>;
      case "phone":
        return <span>{v.phone || "—"}</span>;
      case "gstin":
        return <span className="font-mono text-xs">{v.gstin || "—"}</span>;
      case "products":
        return (
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
            {v._count?.products ?? 0} products
          </span>
        );
      case "status":
        return (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${vendorStatusColor[v.status] || ""}`}
          >
            {v.status}
          </span>
        );
      case "actions":
        return isAdmin ? (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(v)}>
              <FaEdit size={12} />
            </CustomButton>
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(v.id)}>
              <FaTrash size={12} className="text-red-500" />
            </CustomButton>
          </div>
        ) : (
          <span />
        );
      default:
        return <span>—</span>;
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slateGray">Vendors</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage suppliers and B2B product sources
          </p>
        </div>
        {isAdmin && (
          <CustomButton
            leftIcon={<FaPlus size={12} />}
            text="Add Vendor"
            onClick={openCreate}
          />
        )}
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Vendors table"
          classNames={{
            table: ["bg-white"],
            thead: ["bg-gray-50"],
            th: [
              "py-3", "px-4", "text-left", "text-xs",
              "font-semibold", "text-slateGray", "uppercase", "tracking-wide",
            ],
            tbody: ["divide-y", "divide-gray-100"],
            td: ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr: ["hover:bg-gray-50", "transition-colors"],
          }}
        >
          <TableHeader columns={VendorColumns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={vendors ?? []} emptyContent="No vendors found.">
            {(v) => (
              <TableRow key={v.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(v, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editingId ? "Edit Vendor" : "Add Vendor"}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isCreating || isUpdating}
        submitLabel={editingId ? "Update" : "Create"}
        asForm
      >
        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            label="Name"
            isRequired
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            {...register("name")}
          />
          <CustomInput
            label="Email"
            type="email"
            isRequired
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            label="Phone"
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
            {...register("phone")}
          />
          <CustomInput
            label="GSTIN"
            placeholder="e.g. 22AAAAA0000A1Z5"
            isInvalid={!!errors.gstin}
            errorMessage={errors.gstin?.message}
            {...register("gstin")}
          />
        </div>

        <CustomTextarea
          label="Address"
          rows={2}
          isInvalid={!!errors.address}
          errorMessage={errors.address?.message}
          {...register("address")}
        />

        <CustomSingleSelectInput
          label="Status"
          value={vendorStatusOptions.find((o) => o.value === watch("status")) ?? null}
          options={vendorStatusOptions}
          onChange={(selected) => {
            if (selected) setValue("status", selected.value);
          }}
          isClearable={false}
          placeholder="Select status"
        />
      </FormModal>

      <DeleteModal
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        entityName="Vendor"
      />
    </div>
  );
};

export default VendorsPage;
