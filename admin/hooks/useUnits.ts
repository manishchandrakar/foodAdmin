import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCrudHooks } from "./useCrud";
import { UnitCreateSchema } from "@/lib/schemas";
import type { IUnitResponse } from "@/types/api";
import type { IUnitFormValues } from "@/types/commonTypes";

const unitCrud = createCrudHooks<IUnitResponse>("/api/units", "units", {
  entityName: "Unit",
});

export const useUnits = unitCrud.useGetAll;
export const useUnit = unitCrud.useGetById;
export const useCreateUnit = unitCrud.useCreate;
export const useUpdateUnit = unitCrud.useUpdate;
export const useDeleteUnit = unitCrud.useDelete;

export const useUnitForm = () => {
  const form = useForm<IUnitFormValues>({
    resolver: zodResolver(UnitCreateSchema),
    defaultValues: {
      name: "",
      symbol: "",
    },
  });

  const resetForCreate = useCallback(() => {
    form.reset({ name: "", symbol: "" });
  }, [form]);

  const resetForEdit = useCallback(
    (unit: IUnitResponse) => {
      form.reset({
        name: unit.name,
        symbol: unit.symbol,
      });
    },
    [form],
  );

  return { form, resetForCreate, resetForEdit };
};
