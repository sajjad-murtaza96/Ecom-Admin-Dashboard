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
import { OrderSummary } from "@/components/order-summary";
import { CartOrderSummaryLines } from "./components/order-summary/total-lines";
import { CheckoutButtonContent } from "./components/order-summary/checkout-button";
import { ArrowLeftIcon } from "lucide-react";
import { CheckoutStepper } from "@/components/checkout/stepper/stepper";
import { steps } from "@/components/checkout/stepper/stepper-config";
import { CartProvider } from "@/context/cart/provider";
import { FreeDeliveryProgressBar } from "./components/order-summary/free-delivery-progress-bar";
import { PromoCode } from "./components/order-summary/promo-code";

export const metadata: Metadata = { title: "Shopping Cart" };

export default async function CartPage() {
  const cart = await getCartByUserIdAction();
  return (
    <>
      <main className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="text-3xl font-semibold">Shopping Cart</h1>
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

const CheckoutButton = () => {
  return (
    <Link
      href="/checkout"
      className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
    >
      <CheckoutButtonContent />
    </Link>
  )
}

const EmptyCart = () => {
  return (
    <section
      aria-labelledby="empty-cart-title"
      className="mt-8 border-y border-gray-200 bg-gray-50 px-6 py-16 text-center sm:py-24"
    >
      <div className="mx-auto flex w-full max-w-sm flex-col items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
          <ShoppingBagIcon aria-hidden="true" className="h-10 w-10 text-indigo-600" />
        </div>
        <h2 id="empty-cart-title" className="mt-6 text-2xl font-semibold leading-tight tracking-normal text-gray-900">
          Your cart is empty
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Explore our products and find your next favorite.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 active:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 sm:w-auto"
        >
          <ArrowLeftIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
          Continue Shopping
        </Link>
      </div>
    </section>
  );
};

async function AwaitedCartItems({ cart }: { cart: Cart }) {
  const items = await getCartItemsAction(cart.id);
  return items.length === 0 ?
    <EmptyCart /> :
    <CartProvider items={items}>
      <CartItems items={items} >
        <OrderSummary
          id="cart-order-summary"
          headerContent={<CheckoutStepper steps={steps} activeStep={0} compact />}
          footer={<CheckoutButton />}
        >
          <PromoCode />
          <FreeDeliveryProgressBar />
          <CartOrderSummaryLines />
        </OrderSummary>
      </CartItems>
    </CartProvider>
}
