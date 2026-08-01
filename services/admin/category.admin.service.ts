import { api } from "@/lib/api";
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
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: SpringPage<Category>;
  }>("/api/admin/categories", {
    params: { page: 0, size: 100, sort: "name,asc" },
  });
  return response.data.data.content;
}

export async function getCategoryById(id: number): Promise<Category> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Category;
  }>(`/api/admin/categories/${id}`);
  return response.data.data;
}

export interface CategoryPayload {
  name: string;
  slug?: string;
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: Category;
  }>("/api/admin/categories", payload);
  return response.data.data;
}

export async function updateCategory(id: number, payload: CategoryPayload): Promise<Category> {
  const response = await api.put<{
    success: boolean;
    message: string;
    data: Category;
  }>(`/api/admin/categories/${id}`, payload);
  return response.data.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/api/admin/categories/${id}`);
}
