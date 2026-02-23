import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCrudHooks } from "./useCrud";
import { PaymentUpdateFormSchema} from "@/lib/schemas";
import type { IPaymentResponse } from "@/types/api";
import { EnumTransactionStatus } from "@/types/enum";
import { PaymentUpdateFormValues } from "@/utils/validators";

const paymentCrud = createCrudHooks<IPaymentResponse>("/api/payments", "payments", {
  entityName: "Payment",
});

export const usePayments = paymentCrud.useGetAll;
export const usePayment = paymentCrud.useGetById;
export const useCreatePayment = paymentCrud.useCreate;
export const useUpdatePayment = paymentCrud.useUpdate;
export const useDeletePayment = paymentCrud.useDelete;

export const usePaymentForm = () => {
  const form = useForm<PaymentUpdateFormValues>({
    resolver: zodResolver(PaymentUpdateFormSchema),
    defaultValues: {
      transactionId: "",
      paymentStatus: EnumTransactionStatus.PENDING,
    },
  });

  const resetForEdit = useCallback(
    (payment: IPaymentResponse) => {
      form.reset({
        transactionId: payment.transactionId ?? "",
        paymentStatus: payment.paymentStatus,
      });
    },
    [form],
  );

  return { form, resetForEdit };
};
