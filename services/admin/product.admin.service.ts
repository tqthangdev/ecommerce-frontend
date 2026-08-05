import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";
import { Product, ProductVariant, ProductImage } from "@/types/product";
import { PageResponse } from "@/types/api";

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

export interface VariantPayload {
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

export const getProducts = (
  page = 0,
  size = 10
): Promise<PageResponse<Product>> =>
  request(
    api.get<ApiResponse<PageResponse<Product>>>("/api/admin/products", {
      params: { page, size },
    }),
    {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: page,
      size,
      page: 0,
      first: true,
      last: true,
      empty: true,
    } as PageResponse<Product>
  );

export const getProductById = (id: number): Promise<Product> =>
  request(
    api.get<ApiResponse<Product>>(`/api/admin/products/${id}`),
    {} as Product
  );

export const createProduct = (
  payload: ProductPayload
): Promise<Product> =>
  request(
    api.post<ApiResponse<Product>>("/api/admin/products", payload),
    {} as Product
  );

export const updateProduct = (
  id: number,
  payload: ProductPayload
): Promise<Product> =>
  request(
    api.put<ApiResponse<Product>>(`/api/admin/products/${id}`, payload),
    {} as Product
  );

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/admin/products/${id}`);
  } catch {}
};

export const addVariant = (
  productId: number,
  payload: VariantPayload
): Promise<ProductVariant> =>
  request(
    api.post<ApiResponse<ProductVariant>>(
      `/api/admin/products/${productId}/variants`,
      payload
    ),
    {} as ProductVariant
  );

export const updateVariant = (
  variantId: number,
  payload: VariantPayload
): Promise<ProductVariant> =>
  request(
    api.put<ApiResponse<ProductVariant>>(
      `/api/admin/products/variants/${variantId}`,
      payload
    ),
    {} as ProductVariant
  );

export const removeVariant = async (
  variantId: number
): Promise<void> => {
  try {
    await api.delete(`/api/admin/products/variants/${variantId}`);
  } catch {}
};

export const addImageByUrl = (
  productId: number,
  imageUrl: string
): Promise<ProductImage> =>
  request(
    api.post<ApiResponse<ProductImage>>(
      `/api/admin/products/${productId}/images`,
      { imageUrl }
    ),
    {} as ProductImage
  );

export const uploadImage = (
  productId: number,
  file: File
): Promise<ProductImage> => {
  const formData = new FormData();
  formData.append("file", file);

  return request(
    api.post<ApiResponse<ProductImage>>(
      `/api/admin/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),
    {} as ProductImage
  );
};

export const removeImage = async (
  imageId: number
): Promise<void> => {
  try {
    await api.delete(`/api/admin/products/images/${imageId}`);
  } catch {}
};

export const setPrimaryImage = (
  imageId: number
): Promise<ProductImage> =>
  request(
    api.put<ApiResponse<ProductImage>>(
      `/api/admin/products/images/${imageId}/primary`
    ),
    {} as ProductImage
  );