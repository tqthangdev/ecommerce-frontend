import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";
import { Address, AddressRequest } from "@/types/address";

export async function getAddresses(): Promise<Address[]> {
  return request(
    api.get<ApiResponse<Address[]>>("/api/addresses"),
    []
  );
}

export async function createAddress(
  payload: AddressRequest
): Promise<Address> {
  return request(
    api.post<ApiResponse<Address>>("/api/addresses", payload),
    {} as Address
  );
}

export async function updateAddress(
  id: number,
  payload: AddressRequest
): Promise<Address> {
  return request(
    api.put<ApiResponse<Address>>(`/api/addresses/${id}`, payload),
    {} as Address
  );
}

export async function deleteAddress(
  id: number
): Promise<void> {
  try {
    await api.delete(`/api/addresses/${id}`);
  } catch {}
}

export async function setDefaultAddress(
  id: number
): Promise<Address> {
  return request(
    api.put<ApiResponse<Address>>(`/api/addresses/${id}/default`),
    {} as Address
  );
}