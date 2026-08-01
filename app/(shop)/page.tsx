import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <h1 className="max-w-3xl text-6xl font-black">Build Your Modern Lifestyle</h1>

          <p className="mt-6 max-w-xl text-xl text-gray-300">
            Premium smartphones, laptops and accessories.
          </p>

          <Link
            href="/products"

            className="mt-10 inline-block rounded-full bg-white px-8 py-4 font-bold text-black transition hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  );
}
