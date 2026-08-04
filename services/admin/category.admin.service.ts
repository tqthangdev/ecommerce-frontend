import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";
import { Category } from "@/types/product";

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface CategoryPayload {
  name: string;
  imageUrl?: string;
  description?: string;
  active?: boolean;
  slug?: string;
}

export const getCategories = () =>
  request(
    api.get<ApiResponse<SpringPage<Category>>>("/api/admin/categories", {
      params: { page: 0, size: 100, sort: "name,asc" },
    }),
    {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 100,
      last: true,
    }
  ).then((page) => page.content);

export const getCategoryById = (id: number) =>
  request(
    api.get<ApiResponse<Category>>(`/api/admin/categories/${id}`),
    {} as Category
  );

export const createCategory = (payload: CategoryPayload) =>
  request(
    api.post<ApiResponse<Category>>("/api/admin/categories", payload),
    {} as Category
  );

export const updateCategory = (id: number, payload: CategoryPayload) =>
  request(
    api.put<ApiResponse<Category>>(`/api/admin/categories/${id}`, payload),
    {} as Category
  );

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/admin/categories/${id}`);
  } catch {
    // Ignore when server is unavailable
  }
};