import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";
import { Product } from "@/types/product";

export type ProductQuery = {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
};

export interface ProductPage {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function getProducts(
  params?: ProductQuery
): Promise<ProductPage> {
  return request(
    api.get<ApiResponse<ProductPage>>("/api/products/search", {
      params,
    }),
    {
      content: [],
      page: params?.page ?? 0,
      size: params?.size ?? 12,
      totalElements: 0,
      totalPages: 0,
    }
  );
}

export async function getProductBySlug(
  slug: string
): Promise<Product> {
  return request(
    api.get<ApiResponse<Product>>(`/api/products/${slug}`),
    {} as Product
  );
}