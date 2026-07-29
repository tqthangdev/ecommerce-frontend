export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
