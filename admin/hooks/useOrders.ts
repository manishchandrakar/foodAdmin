import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiService } from "@/lib/api/apiService";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { invalidateQuery } from "@/utils/queryInvalidator";
import { queryClient } from "@/lib/config/queryClient";
import { getErrorMessage } from "@/utils/utils";
import { createCrudHooks } from "./useCrud";
import { OrderUpdateFormSchema, OrderUpdateFormValues } from "@/lib/schemas";
import type { IOrderResponse } from "@/types/api";
import { EnumOrderStatus } from "@/types/enum";
import queryKeys from "@/utils/queryKeys";

const orderCrud = createCrudHooks<IOrderResponse>("/api/orders", "orders", {
  entityName: "Order",
});

const service = apiService<IOrderResponse>("/api/orders");

export const useOrders = orderCrud.useGetAll;
export const useOrder = orderCrud.useGetById;
export const useCreateOrder = orderCrud.useCreate;
export const useDeleteOrder = orderCrud.useDelete;

// Custom update that also invalidates payments (delivering an order auto-creates a payment)
export const useUpdateOrder = () =>
  useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      service.update(id, payload),
    onSuccess: (_data, variables) => {
      invalidateQuery(queryClient, queryKeys.orders.all);
      invalidateQuery(queryClient, queryKeys.orders.detail(variables.id));
      invalidateQuery(queryClient, queryKeys.payments.all);

      showSuccessToast({
        title: "Order Updated",
        description: "Order has been updated successfully.",
      });
    },
    onError: (error: unknown) => {
      showErrorToast({
        title: "Failed to update Order",
        description: getErrorMessage(error),
      });
    },
  });

export const useOrderForm = (initialStatus?: EnumOrderStatus) => {
  const form = useForm<OrderUpdateFormValues>({
    resolver: zodResolver(OrderUpdateFormSchema),
    defaultValues: {
      status: initialStatus ?? EnumOrderStatus.PENDING,
    },
  });

  const resetForEdit = useCallback(
    (status: EnumOrderStatus) => {
      form.reset({ status });
    },
    [form],
  );

  return { form, resetForEdit };
};
