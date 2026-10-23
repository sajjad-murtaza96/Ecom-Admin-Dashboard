"use client";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { createCartAction } from "@/app/actions/supabase/cart";
import { useRouter } from "next/navigation";

const QUANTITY = 1;

export const ProductPurchase = ({ productId }: { productId: string }) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function addToCart(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      await createCartAction(productId, QUANTITY);
      setHasError(false);
      router.push("/cart");
    } catch (error) {
      setIsSaving(false);
      setHasError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your cart. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={addToCart} className="mt-8">
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <output
          id="product-quantity"
          className="flex h-12 w-16 shrink-0 cursor-default items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-sm font-medium tabular-nums text-gray-600"
        >
          {QUANTITY}
        </output>
        <button
          type="submit"
          disabled={isSaving}
          aria-busy={isSaving}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCartIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
          {isSaving ? "Adding..." : "Add to Cart"}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm ${hasError ? "text-red-600" : "text-green-700"}`}
      >
        {message}
      </p>
    </form>
  );
};
