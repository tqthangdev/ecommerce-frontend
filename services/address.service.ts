import { api, ApiResponse } from "@/lib/api";
import { Address, AddressRequest } from "@/types/address";

export async function getAddresses(): Promise<Address[]> {
  const res = await api.get<ApiResponse<Address[]>>("/api/addresses");
  return res.data.data;
}

export async function createAddress(payload: AddressRequest): Promise<Address> {
  const res = await api.post<ApiResponse<Address>>("/api/addresses", payload);
  return res.data.data;
}

export async function updateAddress(id: number, payload: AddressRequest): Promise<Address> {
  const res = await api.put<ApiResponse<Address>>(`/api/addresses/${id}`, payload);
  return res.data.data;
}

export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/api/addresses/${id}`);
}

export async function setDefaultAddress(id: number): Promise<Address> {
  const res = await api.put<ApiResponse<Address>>(`/api/addresses/${id}/default`);
  return res.data.data;
}
