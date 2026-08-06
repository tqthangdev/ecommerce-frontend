import { Category } from "./category";

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  active: boolean;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  primary: boolean;
}

export interface ProductVariant {
  id: number;
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  minPrice?: number;
  maxPrice?: number;
  salePrice?: number;
  active: boolean;
  featured: boolean;
  viewCount: number;
  category: Category;
  brand: Brand;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export type { Category };