// lib/auth.service.ts
import axios from "axios";
import { api, ApiResponse } from "@/lib/api";

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    name: string;
    roles: string[];
  };
}

export async function login(email: string, password: string) {
  const res = await axios.post<ApiResponse<LoginResponse>>("/api/auth/login", {
    email,
    password,
  });
  return res.data.data;
}

export async function register(name: string, email: string, password: string) {
  const res = await axios.post<ApiResponse<LoginResponse>>("/api/auth/register", {
    fullName: name,
    email,
    password,
  });
  return res.data.data;
}

export async function logout() {
  await axios.post("/api/auth/logout");
}
