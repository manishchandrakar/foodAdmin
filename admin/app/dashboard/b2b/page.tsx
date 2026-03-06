"use client";

import { useState } from "react";
import { useUsers, useUpdateUser } from "@/hooks/useUsers";
import useAuthStore from "@/store/authStore";
import type { IUserResponse } from "@/types/api";
import CustomButton from "@/components/custom/CustomButton";
import CustomSingleSelectInput from "@/components/SingleDropdown";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { FaEdit, FaBuilding } from "react-icons/fa";
import PageSkeleton from "@/components/common/PageSkeleton";
import { EnumCustomerType, EnumUserRole } from "@/types/enum";
import { customerTypeOptions, customerTypeColor } from "@/utils/constants";
import type { ColumnDef } from "@/components/custom/Table";

const b2bColumns: ColumnDef[] = [
  { uid: "id",    name: "#" },
  { uid: "name",  name: "Name" },
  { uid: "email", name: "Email" },
  { uid: "phone", name: "Phone" },
  { uid: "type",  name: "Type" },
  { uid: "actions", name: "" },
];

const B2BPage = () => {
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const { data: users, isLoading } = useUsers();
  const { mutate: update, isPending: isUpdating } = useUpdateUser();

  const b2bCustomers = users?.filter(
    (u) => u.role === EnumUserRole.CUSTOMER && u.customerType === EnumCustomerType.B2B
  ) ?? [];

  const allCustomers = users?.filter((u) => u.role === EnumUserRole.CUSTOMER) ?? [];

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserResponse | null>(null);
  const [selectedType, setSelectedType] = useState<EnumCustomerType>(EnumCustomerType.B2C);

  const openEdit = (u: IUserResponse) => {
    setEditingUser(u);
    setSelectedType(u.customerType ?? EnumCustomerType.B2C);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!editingUser) return;
    update(
      { id: editingUser.id, payload: { customerType: selectedType } },
      { onSuccess: () => setOpen(false) }
    );
  };

  const renderCell = (u: IUserResponse, key: string) => {
    switch (key) {
      case "id":    return <span>{u.id}</span>;
      case "name":  return <span className="font-medium">{u.name}</span>;
      case "email": return <span>{u.email}</span>;
      case "phone": return <span>{u.phone || "—"}</span>;
      case "type":
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${customerTypeColor[u.customerType] || ""}`}>
            {u.customerType === EnumCustomerType.B2B ? "B2B" : "B2C"}
          </span>
        );
      case "actions":
        return isAdmin ? (
          <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(u)}>
            <FaEdit size={12} />
          </CustomButton>
        ) : <span />;
      default:
        return <span>—</span>;
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slateGray">B2B Customers</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Wholesale buyers with special pricing — {b2bCustomers.length} of {allCustomers.length} customers
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide">B2C Customers</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {allCustomers.filter((u) => u.customerType !== EnumCustomerType.B2B).length}
          </p>
          <p className="text-xs text-blue-400 mt-0.5">Retail pricing</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <FaBuilding className="text-purple-500" />
            <p className="text-xs text-purple-500 font-semibold uppercase tracking-wide">B2B Customers</p>
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-1">{b2bCustomers.length}</p>
          <p className="text-xs text-purple-400 mt-0.5">Wholesale pricing</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <Table
          aria-label="B2B customers table"
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
          <TableHeader columns={b2bColumns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={b2bCustomers} emptyContent="No B2B customers yet. Upgrade customers from the Customers page.">
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
        title="Change Customer Type"
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        submitLabel="Save"
      >
        {editingUser && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-600">
              Customer: <span className="font-medium">{editingUser.name}</span>
            </p>
            <CustomSingleSelectInput
              label="Customer Type"
              value={customerTypeOptions.find((o) => o.value === selectedType) ?? null}
              options={customerTypeOptions}
              onChange={(selected) => {
                if (selected) setSelectedType(selected.value);
              }}
              isClearable={false}
              placeholder="Select type"
            />
          </div>
        )}
      </FormModal>
    </div>
  );
};

export default B2BPage;
