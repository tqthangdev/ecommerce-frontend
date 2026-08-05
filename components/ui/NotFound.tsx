import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-bold tracking-tight">404</h1>

        <h2 className="mt-4 text-2xl font-semibold">
          Không tìm thấy trang
        </h2>

        <p className="mt-3 text-muted-foreground">
          Trang bạn đang tìm kiếm không tồn tại, đã bị di chuyển hoặc đường dẫn
          không chính xác.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Về trang chủ
          </Link>

          <Link
            href="/products"
            className="rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </main>
  );
}