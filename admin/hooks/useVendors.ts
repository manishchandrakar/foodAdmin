import { createCrudHooks } from "./useCrud";
import type { IVendorResponse } from "@/types/api";

const vendorCrud = createCrudHooks<IVendorResponse>("/api/vendors", "vendors", {
  entityName: "Vendor",
});

export const useVendors = vendorCrud.useGetAll;
export const useVendor = vendorCrud.useGetById;
export const useCreateVendor = vendorCrud.useCreate;
export const useUpdateVendor = vendorCrud.useUpdate;
export const useDeleteVendor = vendorCrud.useDelete;
