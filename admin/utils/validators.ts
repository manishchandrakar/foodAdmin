import z from "zod";
import { AsideItemSchema, CategoryCreateSchema, CustomerFormSchema, OrderUpdateFormSchema, PaymentUpdateFormSchema, StatSchema } from "@/lib/schemas";

export type IStat = z.infer<typeof StatSchema>
export type IAsideItem = z.infer<typeof AsideItemSchema>
export type OrderUpdateFormValues = z.infer<typeof OrderUpdateFormSchema>
export type PaymentUpdateFormValues = z.infer<typeof PaymentUpdateFormSchema>
export type CustomerFormValues = z.infer<typeof CustomerFormSchema>
export type CategoryFormValues = z.infer<typeof CategoryCreateSchema>;
