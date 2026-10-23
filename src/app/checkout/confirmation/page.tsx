import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CreditCard, MapPin, Package, ShoppingBag, Truck } from "lucide-react";
import { Stripe } from "stripe";
import { getUser } from "@/db/supabase/query";
import { OrderSummary, OrderSummaryLines } from "@/components/order-summary";
import { readOrderSnapshot } from "@/utilities/order";
import { ConfirmationControls } from "./confirmation-controls";

export const metadata: Metadata = { title: "Order Confirmation", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const cardBrands: Record<string, string> = { visa: "Visa", mastercard: "Mastercard", amex: "American Express", discover: "Discover", diners: "Diners Club", jcb: "JCB", unionpay: "UnionPay" };

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ payment_intent?: string | string[] }> }) {
  const { payment_intent: paymentId } = await searchParams;
  if (typeof paymentId !== "string" || !/^pi_[a-zA-Z0-9]+$/.test(paymentId)) notFound();

  const { data: { user }, error } = await getUser();
  if (error || !user) redirect("/login");
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return <Unavailable />;

  let intent: Stripe.PaymentIntent;
  try {
    intent = await new Stripe(secretKey).paymentIntents.retrieve(paymentId, { expand: ["latest_charge"] });
  } catch {
    return <Unavailable />;
  }
  if (intent.metadata.userId !== user.id) notFound();

  const order = readOrderSnapshot(intent.metadata);
  if (!order || intent.currency !== "usd") return <Unavailable />;
  const subtotal = order.items.reduce((total, item) => total + item.unitAmount * item.quantity, 0);
  const total = subtotal + order.delivery.priceCents;
  if (total !== intent.amount) return <Unavailable />;

  const confirmed = intent.status === "succeeded" && intent.amount_received === intent.amount;
  if (!confirmed && intent.status !== "processing") {
    return <Unavailable message="This payment has not completed. Return to checkout to review your payment." />;
  }

  const charge = typeof intent.latest_charge === "object" ? intent.latest_charge : null;
  const paymentDetails = charge?.payment_method_details;
  const card = paymentDetails?.card;
  const orderNumber = `EC-${intent.id.slice(3).toUpperCase()}`;
  const address = order.shippingAddress;
  const paymentName = card ? (card.brand ? cardBrands[card.brand] ?? "Card" : "Card") : (paymentDetails?.type.replaceAll("_", " ") ?? "Payment details pending");

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <ConfirmationControls orderNumber={orderNumber} confirmed={confirmed} />
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)] lg:gap-16">
          <div className="min-w-0 divide-y divide-gray-200">
            <section aria-labelledby="confirmation-payment" className="pb-8">
              <h2 id="confirmation-payment" className="flex items-center gap-2 text-lg font-semibold">
                <CreditCard aria-hidden="true" className="h-5 w-5 text-gray-500" /> Payment details
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                  <CreditCard aria-hidden="true" className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium capitalize">{paymentName}</p>
                  {card?.last4 && <p className="mt-1 font-mono text-sm text-gray-600">**** **** **** {card.last4}</p>}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${confirmed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {confirmed ? "Paid" : "Processing"}
                </span>
              </div>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex flex-wrap justify-between gap-2"><dt className="text-gray-500">{confirmed ? "Amount paid" : "Order amount"}</dt><dd className="font-medium">{currency.format(intent.amount / 100)}</dd></div>
                <div className="flex flex-wrap justify-between gap-2"><dt className="text-gray-500">Order date</dt><dd>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(intent.created * 1000))}</dd></div>
              </dl>
            </section>

            <div className="grid gap-8 py-8 sm:grid-cols-2">
              <section aria-labelledby="confirmation-address" className="min-w-0">
                <h2 id="confirmation-address" className="flex items-center gap-2 text-base font-semibold"><MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-gray-500" /> Shipping address</h2>
                <address className="mt-4 break-words text-sm not-italic leading-6 text-gray-600">
                  <p className="font-medium text-gray-900">{address.firstName} {address.lastName}</p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>{[address.city, address.state, address.postalCode].filter(Boolean).join(", ")}</p>
                  {address.country && <p>{address.country}</p>}
                  <p className="mt-3">{address.email}</p>
                  <p>{address.phone}</p>
                </address>
              </section>
              <section aria-labelledby="confirmation-delivery" className="min-w-0">
                <h2 id="confirmation-delivery" className="flex items-center gap-2 text-base font-semibold"><Truck aria-hidden="true" className="h-5 w-5 shrink-0 text-gray-500" /> Delivery method</h2>
                <p className="mt-4 break-words text-sm font-medium">{order.delivery.title}</p>
                <p className="mt-1 text-sm text-gray-600">{order.delivery.description}</p>
                <p className="mt-3 text-sm text-gray-600">{order.delivery.priceCents === 0 ? "Free shipping" : currency.format(order.delivery.priceCents / 100)}</p>
              </section>
            </div>
            <div className="pt-8">
              <Link href="/shop" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"><ShoppingBag aria-hidden="true" className="h-4 w-4" /> Continue shopping</Link>
            </div>
          </div>

          <OrderSummary id="confirmation-summary">
            <OrderSummaryLines lines={[{ label: "Subtotal", value: subtotal }, { label: "Shipping", value: order.delivery.priceCents === 0 ? "Free" : order.delivery.priceCents }]} total={total} totalLabel="Total">
              <ul className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
                {order.items.map((item, index) => (
                  <li key={`${item.name}-${index}`} className="flex min-w-0 items-start gap-3 py-4">
                    <Package aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-1"><p className="break-words text-sm font-medium">{item.name}</p><p className="mt-1 text-xs text-gray-500">Qty {item.quantity} &middot; {currency.format(item.unitAmount / 100)} each</p></div>
                    <p className="shrink-0 text-sm font-medium">{currency.format(item.unitAmount * item.quantity / 100)}</p>
                  </li>
                ))}
              </ul>
            </OrderSummaryLines>
          </OrderSummary>
        </div>
      </div>
    </main>
  );
}

function Unavailable({ message = "We could not load this order confirmation. Please contact support with your payment reference." }: { message?: string }) {
  return (
    <main className="min-h-screen bg-white px-4 py-16 text-gray-900">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-semibold">Order confirmation unavailable</h1>
        <p role="alert" className="mt-4 text-sm leading-6 text-gray-600">{message}</p>
        <Link href="/shop" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">Return to shop</Link>
      </div>
    </main>
  );
}