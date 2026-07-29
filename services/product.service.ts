import { api } from "@/lib/api";
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

export async function getProducts(
  params?: ProductQuery,
): Promise<{
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: {
      content: Product[];
      page: number;
      size: number;
      totalElements: number;
      totalPages: number;
    };
  }>("/api/products/search", { params });

  return response.data.data;
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Product;
  }>(`/api/products/${slug}`);

  return response.data.data;
}
