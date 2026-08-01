import { api } from "@/lib/api";
import { Brand } from "@/types/product";

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export async function getBrands(): Promise<Brand[]> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: SpringPage<Brand>;
  }>("/api/admin/brands", {
    params: { page: 0, size: 100, sort: "name,asc" },
  });
  return response.data.data.content;
}

export async function getBrandById(id: number): Promise<Brand> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Brand;
  }>(`/api/admin/brands/${id}`);
  return response.data.data;
}

export interface BrandPayload {
  name: string;
  logoUrl?: string;
  description?: string;
  active?: boolean;
}

export async function createBrand(payload: BrandPayload): Promise<Brand> {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: Brand;
  }>("/api/admin/brands", payload);
  return response.data.data;
}

export async function updateBrand(id: number, payload: BrandPayload): Promise<Brand> {
  const response = await api.put<{
    success: boolean;
    message: string;
    data: Brand;
  }>(`/api/admin/brands/${id}`, payload);
  return response.data.data;
}

export async function deleteBrand(id: number): Promise<void> {
  await api.delete(`/api/admin/brands/${id}`);
}
