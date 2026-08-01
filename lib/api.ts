// lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore, User } from "@/stores/auth.store";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  traceId?: string;
  timestamp?: string;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

export function clearAuth() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("auth-storage");
  useAuthStore.getState().setAccessToken(null);
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

let isRefreshing = false;

let pendingQueue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string> {
  const res = await axios.post<ApiResponse<{ accessToken: string; user: User }>>(
    `${API_BASE_URL}/api/auth/refresh`,
    {},
    { withCredentials: true }
  );

  const { accessToken, user } = res.data.data;
  useAuthStore.getState().setAuth(user, accessToken);

  return accessToken;
}

export async function restoreAccessToken(): Promise<boolean> {
  const token = useAuthStore.getState().accessToken;

  if (token) return true;

  try {
    await refreshAccessToken();
    return true;
  } catch {
    clearAuth();
    return false;
  }
}

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isExcludedFromRefresh = AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH.some((path) =>
      originalRequest.url?.includes(path)
    );

    if (error.response?.status !== 401 || originalRequest._retry || isExcludedFromRefresh) {
      return Promise.reject(new Error(getErrorMessage(error)));
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) {
            reject(new Error("Session expired."));
            return;
          }

          originalRequest.headers.set("Authorization", `Bearer ${token}`);

          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const accessToken = await refreshAccessToken();

      pendingQueue.forEach((callback) => {
        callback(accessToken);
      });

      pendingQueue = [];

      originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);

      return api(originalRequest);
    } catch {
      pendingQueue.forEach((callback) => {
        callback(null);
      });

      pendingQueue = [];

      clearAuth();

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(new Error("Session expired."));
    } finally {
      isRefreshing = false;
    }
  }
);

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return "Unable to connect to the server.";
    }

    const data = err.response.data as ApiResponse<unknown> | undefined;

    switch (err.response.status) {
      case 401:
        return data?.message || "Session expired.";

      case 403:
        return data?.message || "You do not have permission.";

      case 404:
        return data?.message || "Resource not found.";

      case 429:
        return data?.message || "Too many attempts. Please try again later.";

      case 500:
        return "Internal server error.";

      default:
        return data?.message || "Request failed.";
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Something went wrong.";
}
