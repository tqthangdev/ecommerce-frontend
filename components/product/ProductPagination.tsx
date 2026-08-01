"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function ProductPagination({ currentPage, totalPages }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  function changePage(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="mt-8 flex justify-center gap-2">
      {Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1
      ).map((page) => (
        <button
          key={page}
          onClick={() => changePage(page)}
          className={`rounded border px-4 py-2 ${
            currentPage === page ? "bg-black text-white" : ""
          } `}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
