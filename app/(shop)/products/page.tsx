import ProductSearch from "@/components/product/ProductSearch";
import ProductSort from "@/components/product/ProductSort";
import ProductFilter from "@/components/product/ProductFilter";
import ProductList from "@/components/product/ProductList";

type SearchParams = {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  keyword?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <ProductSearch />
      </div>

      <div className="mb-6">
        <ProductSort />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <ProductFilter />
        <div className="md:col-span-3">
          <ProductList
            keyword={params.keyword}
            categoryId={params.categoryId}
            minPrice={params.minPrice}
            maxPrice={params.maxPrice}
            sort={params.sort}
            page={params.page}
          />
        </div>
      </div>
    </main>
  );
}
