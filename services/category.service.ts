import { api, ApiResponse } from "@/lib/api";
import { request } from "@/lib/request";
import { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  const page = await request(
    api.get<ApiResponse<{ content: Category[] }>>("/api/categories"),
    {
      content: [],
    }
  );

  return page.content;
}