import { api } from "@/lib/api";
import { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: { content: Category[] };
  }>("/api/categories");
  return response.data.data.content;
}
