import { useQuery, useMutation } from "@tanstack/react-query";
import { apiService } from "@/lib/api/apiService";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { invalidateQuery } from "@/utils/queryInvalidator";
import { queryClient } from "@/lib/config/queryClient";
import { getErrorMessage } from "@/utils/utils";

interface IUseCrudOptions {
  entityName: string;
}

export const createCrudHooks = <T extends { id: string }>(
  endpoint: string,
  queryKey: string,
  options: IUseCrudOptions,
) => {
  const service = apiService<T>(endpoint);
  const { entityName } = options;
  const allKey = [queryKey];
  const detailKey = (id: string) => [queryKey, id];

  const useGetAll = () =>
    useQuery({
      queryKey: allKey,
      queryFn: service.getAll,
    });

  const useGetById = (id: string) =>
    useQuery({
      queryKey: detailKey(id),
      queryFn: () => service.getById(id),
    });

  const useCreate = () => {
    return useMutation({
      mutationFn: (payload: Record<string, unknown>) => service.create(payload),
      onSuccess: () => {
        invalidateQuery(queryClient, allKey);
        showSuccessToast({
          title: `${entityName} Created`,
          description: `${entityName} has been created successfully.`,
        });
      },
      onError: (error: unknown) => {
        showErrorToast({
          title: `Failed to create ${entityName}`,
          description: getErrorMessage(error),
        });
      },
    });
  };

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
        service.update(id, payload),
      onSuccess: (_data, variables) => {
        invalidateQuery(queryClient, allKey);
        invalidateQuery(queryClient, detailKey(variables.id));
        showSuccessToast({
          title: `${entityName} Updated`,
          description: `${entityName} has been updated successfully.`,
        });
      },
      onError: (error: unknown) => {
        showErrorToast({
          title: `Failed to update ${entityName}`,
          description: getErrorMessage(error),
        });
      },
    });
  };

  const useDelete = () => {
    return useMutation({
      mutationFn: (id: string) => service.delete(id),
      onSuccess: () => {
        invalidateQuery(queryClient, allKey);
        showSuccessToast({
          title: `${entityName} Deleted`,
          description: `${entityName} has been deleted successfully.`,
        });
      },
      onError: (error: unknown) => {
        showErrorToast({
          title: `Failed to delete ${entityName}`,
          description: getErrorMessage(error),
        });
      },
    });
  };

  return { useGetAll, useGetById, useCreate, useUpdate, useDelete };
};
