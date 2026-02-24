import { QueryClient } from "@tanstack/react-query";

export const invalidateQuery = (
  queryClient: QueryClient,
  queryKey: unknown[]
) => {
  queryClient.invalidateQueries({ queryKey });
};