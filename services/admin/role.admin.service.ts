import { api } from "@/lib/api";
import { request } from "@/lib/request";

export interface Role {
  name: string;
}

export async function getAvailableRoles() {
  return request(
    api.get("/api/admin/users/roles"),
    [] as Role[]
  );
}