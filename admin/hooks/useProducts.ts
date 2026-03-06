import { useCallback } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCrudHooks } from "./useCrud";
import { ProductFormSchema, ProductFormValues } from "@/lib/schemas";
import type { IProductResponse } from "@/types/api";
import { EnumStatus } from "@/types/enum";

const productCrud = createCrudHooks<IProductResponse>(
  "/api/products",
  "products",
  {
    entityName: "Product",
  },
);

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
  b2bPrice: undefined,
  minOrderQty: undefined,
  stock: 0,
  image: "",
  status: EnumStatus.ACTIVE,
  categoryId: undefined,
  unitId: undefined,
  gstRateId: undefined,
  vendorId: undefined,
};

export const useProductForm = () => {
  // let React Hook Form infer the form values type from the Zod schema
  // instead of specifying a generic.  Providing <ProductFormValues>
  // directly caused a type incompatibility with the resolver because
  // the preprocessed fields were seen as `unknown`.
  const form = useForm<ProductFormValues>({
    // zodResolver's inferred field type can be overly permissive when using
    // preprocessors, so we assert the resolver's type to the expected
    // `ProductFormValues` to keep the compiler happy.
    resolver: zodResolver(
      ProductFormSchema,
    ) as unknown as Resolver<ProductFormValues>,
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
        mrp:
          product.mrp !== null && product.mrp !== undefined
            ? Number(product.mrp)
            : undefined,
        b2bPrice:
          product.b2bPrice !== null && product.b2bPrice !== undefined
            ? Number(product.b2bPrice)
            : undefined,
        minOrderQty:
          product.minOrderQty !== null && product.minOrderQty !== undefined
            ? Number(product.minOrderQty)
            : undefined,
        stock: Number(product.stock),
        image: product.image ?? "",
        status: product.status,
        categoryId: product.categoryId ? String(product.categoryId) : undefined,
        unitId: product.unitId ? String(product.unitId) : undefined,
        gstRateId: product.gstRateId ? String(product.gstRateId) : undefined,
        vendorId: product.vendorId ? String(product.vendorId) : undefined,
      });
    },
    [form],
  );

  return { form, resetForCreate, resetForEdit };
};
