"use client";
import { useRouter } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import BackButton from "@/components/ui/BackButton"

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <BackButton label="Back to Cart" path="/cart" />
      </div>

      <CheckoutForm />
    </main>
  );
}