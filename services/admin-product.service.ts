import { api } from "@/lib/api";

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  brandId: number;
  categoryId: number;
  image?: File;
}

export async function createProduct(data: CreateProductRequest) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", String(data.price));
  formData.append("brandId", String(data.brandId));
  formData.append("categoryId", String(data.categoryId));

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.post("/api/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}
