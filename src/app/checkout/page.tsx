import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutSteps } from "@/components/checkout/steps";
import {
  getCartByUserIdAction,
  getCartItemsAction,
} from "@/app/actions/supabase/cart";
import { Cart, getCartSubtotal } from "@/utilities/cart";
import { ReactNode, Suspense } from "react";
import CheckoutSkeleton from "./skeletons/checkout-skeleton";
import { Payment } from "@/components/checkout/payment";
import { OrderSummary } from "@/components/order-summary";
import { CheckoutProvider } from "@/context/checkout/provider";
import { ItemLines } from "@/components/checkout/order-summary/item-lines";
import { ShippingAddress } from "@/components/checkout/shipping-address";
import { CheckoutOrderSummaryLines } from "@/components/checkout/order-summary/total-lines";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const cart = await getCartByUserIdAction()
  return (
    <>
      <main className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            <Link href="/cart" className="hover:text-indigo-600">
              Shopping cart
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="font-medium text-gray-900">Checkout</span>
          </nav>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Checkout
          </h1>

          {!cart ? <Suspense fallback={<CheckoutSkeleton />}><UnAuthorizedCheckout /></Suspense> : (
            <Suspense fallback={<CheckoutSkeleton />}>
              <Checkout cart={cart} />
            </Suspense>
          )}
        </div>
      </main>
    </>
  );
}

async function UnAuthorizedCheckout() {
  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12 text-center sm:px-12">
      <h2 className="text-xl font-semibold">Sign in to continue</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
        Your cart is linked to your account. Sign in to review your items and
        continue checkout.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
      >
        Sign in
      </Link>
    </section>
  );
}

async function Checkout({ cart }: { cart: Cart }) {
  const items = await getCartItemsAction(cart.id);
  const subtotal = getCartSubtotal(items);
  return (
    <CheckoutProvider>
      <CheckoutWrapper>
        <CheckoutSteps shipping={<ShippingAddress />} payment={<Payment />} />
        <OrderSummary
          id="checkout-order-summary"
          headerAction={
            <Link
              href="/cart"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Edit cart
            </Link>
          }
          footer={
            <p className="mt-4 text-xs leading-5 text-gray-500">
              Order total excludes any applicable taxes.
            </p>
          }
        >
          <CheckoutOrderSummaryLines subtotal={subtotal} itemLines={<ItemLines items={items} />} />
        </OrderSummary>
      </CheckoutWrapper>
    </CheckoutProvider>
  );
}

async function CheckoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)] lg:gap-16">
      {children}
    </div>
  )
}