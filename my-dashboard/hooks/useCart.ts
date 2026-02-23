import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/config/axios";
import { createCrudHooks } from "./useCrud";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { invalidateQuery } from "@/utils/queryInvalidator";
import { queryClient } from "@/lib/config/queryClient";
import { getErrorMessage } from "@/utils/utils";
import type { ICartItemResponse, ICartResponse, IOrderResponse } from "@/types/api";
import queryKeys from "@/utils/queryKeys";

const cartCrud = createCrudHooks<ICartResponse>("/api/cart", "carts", {
  entityName: "Cart",
});

export const useCarts = cartCrud.useGetAll;
export const useCart = cartCrud.useGetById;
export const useCreateCart = cartCrud.useCreate;
export const useUpdateCart = cartCrud.useUpdate;
export const useDeleteCart = cartCrud.useDelete;

export const useAddCartItem = () =>
  useMutation({
    mutationFn: async ({
      cartId,
      payload,
    }: {
      cartId: string;
      payload: Record<string, unknown>;
    }) => {
      const { data } = await api.post<ICartItemResponse>(
        `/api/cart/${cartId}/items`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      invalidateQuery(queryClient, ["carts"]);
      showSuccessToast({
        title: "Item Added",
        description: "Item has been added to the cart.",
      });
    },
    onError: (error: unknown) => {
      showErrorToast({
        title: "Failed to add item",
        description: getErrorMessage(error),
      });
    },
  });

export const useUpdateCartItem = () =>
  useMutation({
    mutationFn: async ({
      cartId,
      itemId,
      payload,
    }: {
      cartId: string;
      itemId: string;
      payload: Record<string, unknown>;
    }) => {
      const { data } = await api.put<ICartItemResponse>(
        `/api/cart/${cartId}/items/${itemId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      invalidateQuery(queryClient, queryKeys.carts.all);
      showSuccessToast({
        title: "Item Updated",
        description: "Cart item has been updated.",
      });
    },
    onError: (error: unknown) => {
      showErrorToast({
        title: "Failed to update item",
        description: getErrorMessage(error),
      });
    },
  });

export const useRemoveCartItem = () =>
  useMutation({
    mutationFn: async ({
      cartId,
      itemId,
    }: {
      cartId: string;
      itemId: string;
    }) => {
      await api.delete(`/api/cart/${cartId}/items/${itemId}`);
    },
    onSuccess: () => {
      invalidateQuery(queryClient, queryKeys.carts.all);
      showSuccessToast({
        title: "Item Removed",
        description: "Item has been removed from the cart.",
      });
    },
    onError: (error: unknown) => {
      showErrorToast({
        title: "Failed to remove item",
        description: getErrorMessage(error),
      });
    },
  });

export const useCheckoutCart = () =>
  useMutation({
    mutationFn: async ({
      cartId,
      payload,
    }: {
      cartId: string;
      payload: Record<string, unknown>;
    }) => {
      const { data } = await api.post<IOrderResponse>(
        `/api/cart/${cartId}/checkout`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      invalidateQuery(queryClient, queryKeys.carts.all);
      invalidateQuery(queryClient, queryKeys.orders.all);
      showSuccessToast({
        title: "Checkout Complete",
        description: "Cart has been converted to an order.",
      });
    },
    onError: (error: unknown) => {
      showErrorToast({
        title: "Checkout failed",
        description: getErrorMessage(error),
      });
    },
  });
