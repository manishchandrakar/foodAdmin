"use client";

import { useState } from "react";
import { useReviews, useDeleteReview } from "@/hooks/useReviews";
import CustomButton from "@/components/custom/CustomButton";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@/components/custom/Table";
import { DeleteModal } from "@/components/common/DeleteModal";
import { FaTrash, FaStar } from "react-icons/fa";
import PageSkeleton from "@/components/common/PageSkeleton";
import type { IReviewResponse } from "@/types/api";
import { ratingColor, ReviewColumns } from "@/utils/constants";
import { formatDate } from "@/utils/dateUtils";





const ReviewsPage = () => {
  const { data: reviews, isLoading } = useReviews();
  const { mutate: remove } = useDeleteReview();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteId) remove(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const renderCell = (r: IReviewResponse, key: string) => {
    switch (key) {
      case "id":
        return <span>{r.id}</span>;
      case "user":
        return <span>{r.user?.name || `User #${r.userId}`}</span>;
      case "product":
        return <span>{r.product?.name || `Product #${r.productId}`}</span>;
      case "rating":
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ratingColor(r.rating)}`}>
            <FaStar size={10} /> {r.rating}/5
          </span>
        );
      case "comment":
        return <span className="max-w-xs truncate block">{r.comment}</span>;
      case "createdAt":
        return <span>{formatDate(r.createdAt) ?? "—"}</span>;
      case "actions":
        return (
          <CustomButton variant="ghost" className="size-7 p-0" onClick={() => setDeleteId(r.id)}>
            <FaTrash size={12} className="text-red-500" />
          </CustomButton>
        );
      default:
        return <span>—</span>;
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slateGray">Reviews</h1>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <Table
          aria-label="Reviews table"
          classNames={{
            table:  ["bg-white"],
            thead:  ["bg-gray-50"],
            th:     ["py-3", "px-4", "text-left", "text-xs", "font-semibold", "text-slateGray", "uppercase", "tracking-wide"],
            tbody:  ["divide-y", "divide-gray-100"],
            td:     ["py-3", "px-4", "text-sm", "text-slateGray"],
            tr:     ["hover:bg-gray-50", "transition-colors"],
          }}
        >
          <TableHeader columns={ReviewColumns}>
            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
          </TableHeader>
          <TableBody items={reviews ?? []} emptyContent="No reviews found.">
            {(r) => (
              <TableRow key={r.id}>
                {(columnKey) => <TableCell>{renderCell(r, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteModal open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={confirmDelete} entityName="Review" />
    </div>
  );
};

export default ReviewsPage;
