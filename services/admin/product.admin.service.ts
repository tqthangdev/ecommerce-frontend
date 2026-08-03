import { api } from "@/lib/api";
import { Product, ProductVariant, ProductImage } from "@/types/product";
import { PageResponse } from "@/types/api";

export async function getProducts(page = 0, size = 10): Promise<PageResponse<Product>> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: PageResponse<Product>;
  }>("/api/admin/products", {
    params: { page, size },
  });
  return response.data.data;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: Product;
  }>(`/api/admin/products/${id}`);
  return response.data.data;
}

export interface ProductPayload {
  name: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  stockQuantity: number;
  categoryId: number;
  brandId: number;
  active: boolean;
  featured: boolean;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: Product;
  }>("/api/admin/products", payload);
  return response.data.data;
}

export async function updateProduct(id: number, payload: ProductPayload): Promise<Product> {
  const response = await api.put<{
    success: boolean;
    message: string;
    data: Product;
  }>(`/api/admin/products/${id}`, payload);
  return response.data.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/api/admin/products/${id}`);
}

export interface VariantPayload {
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

export async function addVariant(
  productId: number,
  payload: VariantPayload
): Promise<ProductVariant> {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: ProductVariant;
  }>(`/api/admin/products/${productId}/variants`, payload);
  return response.data.data;
}

export async function updateVariant(
  variantId: number,
  payload: VariantPayload
): Promise<ProductVariant> {
  const response = await api.put<{
    success: boolean;
    message: string;
    data: ProductVariant;
  }>(`/api/admin/products/variants/${variantId}`, payload);
  return response.data.data;
}

export async function removeVariant(variantId: number): Promise<void> {
  await api.delete(`/api/admin/products/variants/${variantId}`);
}

export async function addImageByUrl(productId: number, imageUrl: string): Promise<ProductImage> {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: ProductImage;
  }>(`/api/admin/products/${productId}/images`, { imageUrl });
  return response.data.data;
}

export async function uploadImage(productId: number, file: File): Promise<ProductImage> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<{
    success: boolean;
    message: string;
    data: ProductImage;
  }>(`/api/admin/products/${productId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}

export async function removeImage(imageId: number): Promise<void> {
  await api.delete(`/api/admin/products/images/${imageId}`);
}

export async function setPrimaryImage(imageId: number): Promise<ProductImage> {
  const response = await api.put<{
    success: boolean;
    message: string;
    data: ProductImage;
  }>(`/api/admin/products/images/${imageId}/primary`);
  return response.data.data;
}
