import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCrudHooks } from "./useCrud";
import { GstRateCreateSchema } from "@/lib/schemas";
import type { IGstRateResponse } from "@/types/api";
import type { IGstRateFormValues } from "@/types/commonTypes";

const gstRateCrud = createCrudHooks<IGstRateResponse>("/api/gst-rates", "gstRates", {
  entityName: "GST Rate",
});

export const useGstRates = gstRateCrud.useGetAll;
export const useGstRate = gstRateCrud.useGetById;
export const useCreateGstRate = gstRateCrud.useCreate;
export const useUpdateGstRate = gstRateCrud.useUpdate;
export const useDeleteGstRate = gstRateCrud.useDelete;

export const useGstRateForm = () => {
  const form = useForm<IGstRateFormValues>({
    resolver: zodResolver(GstRateCreateSchema),
    defaultValues: {
      name: "",
      percentage: 0,
    },
  });

  const resetForCreate = useCallback(() => {
    form.reset({ name: "", percentage: 0 });
  }, [form]);

  const resetForEdit = useCallback(
    (gstRate: IGstRateResponse) => {
      form.reset({
        name: gstRate.name,
        percentage: gstRate.percentage,
      });
    },
    [form],
  );

  return { form, resetForCreate, resetForEdit };
};
