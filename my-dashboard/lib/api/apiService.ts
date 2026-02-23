import { api } from "@/lib/config/axios";
import type { IApiDeleteResponse } from "@/types/api";

export const apiService = <T>(endpoint: string) => ({
  getAll: async (): Promise<T[]> => {
    const { data } = await api.get<T[]>(endpoint);
    return data;
  },

  getById: async (id: string): Promise<T> => {
    const { data } = await api.get<T>(`${endpoint}/${id}`);
    return data;
  },

  create: async (payload: Record<string, unknown>): Promise<T> => {
    const { data } = await api.post<T>(endpoint, payload);
    return data;
  },

  update: async (id: string, payload: Record<string, unknown>): Promise<T> => {
    const { data } = await api.put<T>(`${endpoint}/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<IApiDeleteResponse> => {
    const { data } = await api.delete<IApiDeleteResponse>(`${endpoint}/${id}`);
    return data;
  },
});
