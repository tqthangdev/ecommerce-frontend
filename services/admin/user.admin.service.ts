import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  enabled: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  password: string;
  enabled: boolean;
  roles: string[];
}

export const getUsers = () =>
  request(
    api.get<ApiResponse<SpringPage<AdminUser>>>("/api/admin/users", {
      params: {
        page: 0,
        size: 100,
        sort: "createdAt",
      },
    }),
    {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 100,
      last: true,
    }
  ).then((page) => page.content);

export const getUserById = (id: number) =>
  request(
    api.get<ApiResponse<AdminUser>>(`/api/admin/users/${id}`),
    {} as AdminUser
  );

export const createUser = (data: CreateUserRequest) =>
  request(
    api.post<ApiResponse<AdminUser>>("/api/admin/users", data),
    {} as AdminUser
  );

export const updateUser = async (
  id: number,
  data: {
    fullName: string;
    email: string;
    password?: string;
    enabled: boolean;
    roles: string[];
  }
) => {
  const response = await api.put<ApiResponse<AdminUser>>(
    `/api/admin/users/${id}`,
    data
  );

  return response.data;
};