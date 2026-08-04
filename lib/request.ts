import { AxiosResponse } from "axios";
import { ApiResponse } from "./api";

export async function request<T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>,
  fallback: T
): Promise<T> {
  try {
    const res = await promise;

    return res.data.data ?? fallback;
  } catch {
    return fallback;
  }
}