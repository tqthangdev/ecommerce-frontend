import { ProductVariant } from "./product";

export interface CartProduct {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface CartItem {
  product: CartProduct;
  variant: ProductVariant;
  quantity: number;
}
