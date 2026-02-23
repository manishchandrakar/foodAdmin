"use client";

import { useState } from "react";
import {
  usePayments, useUpdatePayment, useDeletePayment, usePaymentForm,
} from "@/hooks/usePayments";
import type { IPaymentResponse } from "@/types/api";
import CustomSingleSelectInput from "@/components/SingleDropdown";
import CustomButton from "@/components/custom/CustomButton";
import CustomInput from "@/components/custom/CustomInput";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@/components/custom/Table";
import { FormModal } from "@/components/common/FormModal";
import { DeleteModal } from "@/components/common/DeleteModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { PaymentsColumns, paymentStatusOptions } from "@/utils/constants";
import PageSkeleton from "@/components/common/PageSkeleton";
import { PaymentUpdateFormValues } from "@/utils/validators";
import { formatDate } from "@/utils/dateUtils";
import { formatNumberToRupees } from "@/utils/utils";

const statusColor: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  failed:    "bg-red-100 text-red-700",
  refunded:  "bg-blue-100 text-blue-700",
};


const PaymentsPage = () => {
  const { data: payments, isLoading } = usePayments();
  const { mutate: update, isPending: isUpdating } = useUpdatePayment();
  const { mutate: remove } = useDeletePayment();

  const { form, resetForEdit } = usePaymentForm();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openEdit = (p: IPaymentResponse) => { setEditingPaymentId(p.id); resetForEdit(p); };
  const onSubmit = (data: PaymentUpdateFormValues) => {
    if (editingPaymentId)
      update(
        { id: editingPaymentId, payload: { transactionId: data.transactionId || undefined, paymentStatus: data.paymentStatus } },
        { onSuccess: () => setEditingPaymentId(null) }
      );
  };
  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (p: IPaymentResponse, key: string) => {
    switch (key) {
      case "id":
        return <span>{p.id}</span>;
      case "order":
        return <span className="font-mono">#{p.orderId}</span>;
      case "customer":
        return <span>{p.order?.user?.name || "—"}</span>;
      case "amount":
        return <span className="font-medium">{p.order ? formatNumberToRupees(p.order.totalAmount) : "—"}</span>;
      case "method":
        return <span className="capitalize">{p.order?.paymentMethod || "—"}</span>;
      case "transactionId":
        return <span className="font-mono text-xs">{p.transactionId || "—"}</span>;
      case "status":
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[p.paymentStatus] || ""}`}>
            {p.paymentStatus}
          </span>
        );
      case "paidAt":
        return <span>{formatDate(p.paidAt ?? undefined) ?? "—"}</span>;
      case "actions":
        return (
          <div className="flex gap-1">
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => openEdit(p)}>
              <FaEdit size={12} />
            </CustomButton>
            <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(p.id)}>
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
        <h1 className="text-2xl font-bold text-slateGray">Payments</h1>
        <p className="text-sm text-gray-400">Payments are auto-created when orders are placed</p>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Payments table"
          classNames={{
            table:  ["bg-white"],
            thead:  ["bg-gray-50"],
            th:     ["py-3", "px-4", "text-left", "text-xs", "font-semibold", "text-slateGray", "uppercase", "tracking-wide"],
            tbody:  ["divide-y", "divide-gray-100"],
            td:     ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr:     ["hover:bg-gray-50", "transition-colors"],
          }}
        >
          <TableHeader columns={PaymentsColumns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={payments ?? []} emptyContent="No payments found.">
            {(p) => (
              <TableRow key={p.id}>
                {(columnKey) => <TableCell>{renderCell(p, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FormModal
        open={!!editingPaymentId}
        onOpenChange={() => setEditingPaymentId(null)}
        title={`Edit Payment #${editingPaymentId}`}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isUpdating}
        submitLabel="Update"
        asForm
      >
        <CustomInput label="Transaction ID"
          isInvalid={!!errors.transactionId} errorMessage={errors.transactionId?.message}
          {...register("transactionId")} />
        <CustomSingleSelectInput
          label="Status"
          value={paymentStatusOptions.find((o) => o.value === watch("paymentStatus")) ?? null}
          options={paymentStatusOptions}
          onChange={(selected) => { if (selected) setValue("paymentStatus", selected.value); }}
          isClearable={false}
          placeholder="Select status"
        />
      </FormModal>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="Payment" />
    </div>
  );
};

export default PaymentsPage;
