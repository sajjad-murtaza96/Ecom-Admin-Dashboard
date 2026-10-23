import type { Metadata } from "next";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Suspense } from "react";
import {
  getCartByUserIdAction,
  getCartItemsAction,
} from "@/app/actions/supabase/cart";
import { CartItems } from "./components/cart-items/cart-items";
import { CartSkeleton } from "./skeletons/cart-skeleton";
import { Cart } from "@/utilities/cart";

export const metadata: Metadata = { title: "Shopping Cart" };

export default async function CartPage() {
  const cart = await getCartByUserIdAction();

  return (
    <>
      <main className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="text-3xl font-semibold">Shopping cart</h1>
          {!cart ? (
            <Suspense fallback={<CartSkeleton />}>
              <UnAuthorizedCart />
            </Suspense>
          ) : (
            <Suspense fallback={<CartSkeleton />}>
              <AwaitedCartItems cart={cart} />
            </Suspense>
          )}
        </div>
      </main>
    </>
  );
}

async function UnAuthorizedCart() {
  return (
    <section
      aria-labelledby="cart-sign-in-title"
      className="mt-8 flex flex-col items-center rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center sm:px-12 sm:py-20"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <ShoppingBagIcon aria-hidden="true" className="h-8 w-8" />
      </div>
      <h2
        id="cart-sign-in-title"
        className="mt-6 text-2xl font-semibold tracking-tight"
      >
        Your cart is waiting for you
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600 sm:text-base">
        Please sign in to view your cart and pick up where you left off.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link
          href="/login"
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
        >
          Sign in
        </Link>
        <Link
          href="/shop"
          className="inline-flex min-h-12 items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
}

async function AwaitedCartItems({ cart }: { cart: Cart }) {
  const items = await getCartItemsAction(cart.id);
  return <CartItems items={items} />;
}
