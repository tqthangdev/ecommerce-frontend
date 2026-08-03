import Link from "next/link";
import ProductSlider from "@/components/product/ProductSlider";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-700 text-white">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-gray-300">
            Premium Online Store
          </span>

          <h1 className="mt-8 max-w-4xl text-6xl font-black leading-tight">
            Everything You Need,
            <span className="block text-gray-400">
              All In One Place
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-xl text-gray-300">
            Discover quality products across fashion, technology, home and everyday essentials.
          </p>

          <Link
            href="/products"
            className="mt-10 inline-block rounded-full bg-white px-8 py-4 font-bold text-black transition hover:scale-105"
          >
            Shop Now →
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">
              Featured Products
            </h2>

            <p className="mt-2 text-gray-400">
              Discover our latest products
            </p>
          </div>

          <Link
            href="/products"
            className="text-gray-300 transition hover:text-white"
          >
            View all →
          </Link>
        </div>

        <ProductSlider />
      </section>
    </main>
  );
}