import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCrudHooks } from "./useCrud";
import { CustomerFormSchema, CustomerFormValues } from "@/lib/schemas";
import type { IUserResponse } from "@/types/api";

const userCrud = createCrudHooks<IUserResponse>("/api/users", "users", {
  entityName: "User",
});

export const useUsers = userCrud.useGetAll;
export const useUser = userCrud.useGetById;
export const useCreateUser = userCrud.useCreate;
export const useUpdateUser = userCrud.useUpdate;
export const useDeleteUser = userCrud.useDelete;

const defaultValues: CustomerFormValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
};

export const useCustomerForm = () => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues,
  });

  const resetForCreate = useCallback(() => {
    form.reset(defaultValues);
  }, [form]);

  const resetForEdit = useCallback(
    (user: IUserResponse) => {
      form.reset({
        name: user.name,
        email: user.email,
        password: "",
        phone: user.phone ?? "",
      });
    },
    [form],
  );

  return { form, resetForCreate, resetForEdit };
};
