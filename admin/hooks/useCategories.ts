import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCrudHooks } from "./useCrud";
import { CategoryCreateSchema, CategoryFormValues } from "@/lib/schemas";
import type { ICategoryResponse } from "@/types/api";

const categoryCrud = createCrudHooks<ICategoryResponse>("/api/categories", "categories", {
  entityName: "Category",
});

export const useCategories = categoryCrud.useGetAll;
export const useCategory = categoryCrud.useGetById;
export const useCreateCategory = categoryCrud.useCreate;
export const useUpdateCategory = categoryCrud.useUpdate;
export const useDeleteCategory = categoryCrud.useDelete;

export const useCategoryForm = () => {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
  });

  const resetForCreate = useCallback(() => {
    form.reset({ name: "", description: "", image: "" });
  }, [form]);

  const resetForEdit = useCallback(
    (category: ICategoryResponse) => {
      form.reset({
        name: category.name,
        description: category.description ?? "",
        image: category.image ?? "",
      });
    },
    [form],
  );

  return { form, resetForCreate, resetForEdit };
};
