"use client";

import { useState } from "react";
import {
  useOrders, useUpdateOrder, useDeleteOrder, useOrderForm,
} from "@/hooks/useOrders";
import useAuthStore from "@/store/authStore";
import type { OrderUpdateFormValues } from "@/lib/schemas";
import type { IOrderResponse } from "@/types/api";
import CustomSingleSelectInput from "@/components/SingleDropdown";
import CustomButton from "@/components/custom/CustomButton";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { OrdersColumns, statusColor, statusOptions } from "@/utils/constants";
import PageSkeleton from "@/components/common/PageSkeleton";
import { formatDate } from "@/utils/dateUtils";
import { formatNumberToRupees } from "@/utils/utils";



const OrdersPage = () => {
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const { data: orders, isLoading } = useOrders();
  const { mutate: update, isPending: isUpdating } = useUpdateOrder();
  const { mutate: remove } = useDeleteOrder();

  const { form, resetForEdit } = useOrderForm();
  const { handleSubmit, watch, setValue } = form;

  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openEdit = (order: IOrderResponse) => {
    setEditOrderId(order.id);
    resetForEdit(order.status);
  };
  const onSubmit = (data: OrderUpdateFormValues) => {
    if (editOrderId)
      update({ id: editOrderId, payload: { status: data.status } }, { onSuccess: () => setEditOrderId(null) });
  };
  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (o: IOrderResponse, key: string) => {
    switch (key) {
      case "id":
        return <span className="font-mono">#{o.id}</span>;
      case "user":
        return <span>{o.user?.name || `User #${o.userId}`}</span>;
      case "totalAmount":
        return <span className="font-medium">{formatNumberToRupees(o.totalAmount)}</span>;
      case "paymentMethod":
        return <span className="capitalize">{o.paymentMethod}</span>;
      case "status":
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[o.status] || ""}`}>
            {o.status}
          </span>
        );
      case "createdAt":
        return <span>{formatDate(o.createdAt) ?? "—"}</span>;
      case "actions":
        return (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(o)}>
              <FaEdit size={12} />
            </CustomButton>
            {isAdmin && (
              <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(o.id)}>
                <FaTrash size={12} className="text-red-500" />
              </CustomButton>
            )}
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
        <h1 className="text-2xl font-bold text-slateGray">Orders</h1>
        <p className="text-sm text-gray-400">Orders are created via Cart checkout</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Orders table"
          classNames={{
            table:  ["bg-white", "dark:bg-zinc-900"],
            thead:  ["bg-gray-50", "dark:bg-zinc-800/50"],
            th:     ["py-3", "px-4", "text-left", "text-xs", "font-semibold", "text-slateGray", "uppercase", "tracking-wide"],
            tbody:  ["divide-y", "divide-gray-100", "dark:divide-zinc-800"],
            td:     ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr:     ["hover:bg-gray-50", "dark:hover:bg-zinc-800/50", "transition-colors"],
          }}
        >
          <TableHeader columns={OrdersColumns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={orders ?? []} emptyContent="No orders found.">
            {(o) => (
              <TableRow key={o.id}>
                {(columnKey) => <TableCell>{renderCell(o, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormModal
        open={!!editOrderId}
        onOpenChange={() => setEditOrderId(null)}
        title={`Update Order #${editOrderId}`}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isUpdating}
        submitLabel="Update"
        asForm
      >
        <CustomSingleSelectInput
          label="Status"
          value={statusOptions.find((o) => o.value === watch("status")) ?? null}
          options={statusOptions}
          onChange={(selected) => { if (selected) setValue("status", selected.value); }}
          isClearable={false}
          placeholder="Select status"
        />
      </FormModal>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="Order" />
    </div>
  );
};

export default OrdersPage;
