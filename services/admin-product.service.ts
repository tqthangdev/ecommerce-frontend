import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";
import { Product } from "@/types/product";

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  brandId: number;
  categoryId: number;
  image?: File;
}

export async function createProduct(
  data: CreateProductRequest
): Promise<Product> {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", String(data.price));
  formData.append("brandId", String(data.brandId));
  formData.append("categoryId", String(data.categoryId));

  if (data.image) {
    formData.append("image", data.image);
  }

  return request(
    api.post<ApiResponse<Product>>(
      "/api/admin/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),
    {} as Product
  );
}