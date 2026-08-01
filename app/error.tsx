"use client";

import { useEffect } from "react";

import Button from "@/components/ui/Button";

type Props = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>

      <p className="mt-3 text-gray-500">Please try again.</p>

      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </div>
  );
}
