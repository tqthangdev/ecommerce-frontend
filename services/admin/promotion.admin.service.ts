import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";

export type PromotionDiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface Promotion {
  id: number;
  name: string;
  description?: string;
  discountType: PromotionDiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  active: boolean;
  expired: boolean;
  variantIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface PromotionPayload {
  name: string;
  description?: string;
  discountType: PromotionDiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  active: boolean;
  variantIds: number[];
}

export const getPromotions = (): Promise<Promotion[]> =>
  request(api.get<ApiResponse<Promotion[]>>("/api/admin/promotions"), []);

export const getPromotionById = (id: number): Promise<Promotion> =>
  request(api.get<ApiResponse<Promotion>>(`/api/admin/promotions/${id}`), {} as Promotion);

export const createPromotion = (payload: PromotionPayload): Promise<Promotion> =>
  request(api.post<ApiResponse<Promotion>>("/api/admin/promotions", payload), {} as Promotion);

export const updatePromotion = (id: number, payload: PromotionPayload): Promise<Promotion> =>
  request(api.put<ApiResponse<Promotion>>(`/api/admin/promotions/${id}`, payload), {} as Promotion);

export const deletePromotion = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/admin/promotions/${id}`);
  } catch {}
};
