export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED" | "RETURNED";

export type PaymentMethod = "COD" | "VNPAY" | "MOMO" | "STRIPE";
export type PaymentStatus = "PENDING" | "UNPAID" | "PAID" | "FAILED" | "RETURNED";

export interface OrderAddress {
  id: number;
  recipientName: string;
  phone: string;
  provinceCode: string;
  provinceName: string;
  districtCode: string;
  districtName: string;
  wardCode: string;
  wardName: string;
  streetAddress: string;
  fullAddress: string;
  defaultAddress: boolean;
  label: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productImageUrl?: string;
  variantId?: number;
  variantSku?: string;
  variantColor?: string;
  variantSize?: string;
  quantity: number;
  unitPrice: number;
  effectivePrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  notes?: string;
  shippingAddress: OrderAddress;
  items: OrderItem[];
  cancellable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutRequest {
  addressId: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface CheckoutResponse {
  orderId: number;
  orderNumber: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentUrl?: string;
  paymentMethod: PaymentMethod;
}
