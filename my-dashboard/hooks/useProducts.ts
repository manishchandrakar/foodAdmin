import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCrudHooks } from "./useCrud";
import { ProductFormSchema, ProductFormValues } from "@/lib/schemas";
import type { IProductResponse } from "@/types/api";
import { EnumStatus } from "@/types/enum";

const productCrud = createCrudHooks<IProductResponse>("/api/products", "products", {
  entityName: "Product",
});

export const useProducts = productCrud.useGetAll;
export const useProduct = productCrud.useGetById;
export const useCreateProduct = productCrud.useCreate;
export const useUpdateProduct = productCrud.useUpdate;
export const useDeleteProduct = productCrud.useDelete;

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  mrp: undefined,
  stock: 0,
  image: "",
  status: EnumStatus.ACTIVE,
  categoryId: undefined,
  unitId: undefined,
  gstRateId: undefined,
};

export const useProductForm = () => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues,
  });

  const resetForCreate = useCallback(() => {
    form.reset(defaultValues);
  }, [form]);

  const resetForEdit = useCallback(
    (product: IProductResponse) => {
      form.reset({
        name: product.name,
        description: product.description,
        price: Number(product.price),
        mrp: product.mrp != null ? Number(product.mrp) : undefined,
        stock: Number(product.stock),
        image: product.image ?? "",
        status: product.status,
        categoryId: product.categoryId ? String(product.categoryId) : undefined,
        unitId: product.unitId ? String(product.unitId) : undefined,
        gstRateId: product.gstRateId ? String(product.gstRateId) : undefined,
      });
    },
    [form],
  );

  return { form, resetForCreate, resetForEdit };
};
