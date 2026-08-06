import Link from "next/link";
import FooterAccount from "./FooterAccount";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            Shopora
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
            Nền tảng mua sắm trực tuyến hiện đại. Cung cấp sản phẩm chất lượng, thanh toán an toàn
            và trải nghiệm tiện lợi.
          </p>

          <div className="mt-6 flex gap-4 text-sm">
            <Link href="#" className="transition hover:text-white">
              Facebook
            </Link>

            <Link href="#" className="transition hover:text-white">
              Instagram
            </Link>

            <Link href="#" className="transition hover:text-white">
              Youtube
            </Link>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="mb-4 font-semibold text-white">Shop</h3>

          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/products" className="transition hover:text-white">
                Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <FooterAccount />

        {/* Information */}
        <div>
          <h3 className="mb-4 font-semibold text-white">Information</h3>

          <ul className="space-y-3 text-sm text-gray-400">
            <li>Privacy Policy</li>

            <li>Terms & Conditions</li>

            <li>Shipping Policy</li>

            <li>Return Policy</li>
          </ul>
        </div>
      </div>

      {/* Contact */}
      <div className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-5">
          <div className="flex flex-col gap-3 text-sm md:flex-row md:justify-between">
            <div>
              <p className="font-medium text-white">Need help?</p>

              <p className="text-gray-400">support@shopora.com · 0123 456 789</p>
            </div>

            <p className="text-gray-400">Ho Chi Minh City, Vietnam</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Ecommerce. All rights reserved.
      </div>
    </footer>
  );
}
