import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";
import { Brand } from "@/types/product";

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface BrandPayload {
  name: string;
  logoUrl?: string;
  description?: string;
  active?: boolean;
}

export const getBrands = () =>
  request(
    api.get<ApiResponse<SpringPage<Brand>>>("/api/admin/brands", {
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
  ).then((page) => page?.content ?? []);

export const getBrandById = (id: number) =>
  request(
    api.get<ApiResponse<Brand>>(`/api/admin/brands/${id}`),
    {} as Brand
  );

export const createBrand = (payload: BrandPayload) =>
  request(
    api.post<ApiResponse<Brand>>("/api/admin/brands", payload),
    {} as Brand
  );

export const updateBrand = (id: number, payload: BrandPayload) =>
  request(
    api.put<ApiResponse<Brand>>(`/api/admin/brands/${id}`, payload),
    {} as Brand
  );

export const deleteBrand = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/admin/brands/${id}`);
  } catch {
    // Ignore when server is unavailable
  }
};