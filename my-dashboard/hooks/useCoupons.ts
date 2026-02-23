import { createCrudHooks } from "./useCrud";
import type { ICouponResponse } from "@/types/api";

const couponCrud = createCrudHooks<ICouponResponse>("/api/coupons", "coupons", {
  entityName: "Coupon",
});

export const useCoupons = couponCrud.useGetAll;
export const useCoupon = couponCrud.useGetById;
export const useCreateCoupon = couponCrud.useCreate;
export const useUpdateCoupon = couponCrud.useUpdate;
export const useDeleteCoupon = couponCrud.useDelete;
