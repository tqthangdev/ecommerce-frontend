"use client";

import { useRouter } from "next/navigation";

type Props = {
  label?: string;
  path?: string;
  className?: string;
};

export default function BackButton({
  className = "",
  label = "Back",
  path,
}: Props) {
  const router = useRouter();

  function handleClick() {
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`rounded border border-black px-4 py-2 text-black transition hover:bg-black hover:text-white ${className}`}
    >
      ← {label}
    </button>
  );
}