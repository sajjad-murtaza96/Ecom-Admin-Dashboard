import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CircleCheck, ClipboardList, CreditCard, MapPin, PackageSearch, ShoppingBag, Truck } from "lucide-react";
import { getUser } from "@/db/supabase/query";
import { getOrderDetailsAction } from "@/app/actions/supabase/order";
import { OrderSummary, OrderSummaryLines } from "@/components/order-summary";
import { getCartSubtotal } from "@/utilities/cart";
import { ConfirmationControls } from "./components/confirmation-controls";
import { computeDeliveryFee } from "@/utilities/checkout";
import { CheckoutStepper } from "@/components/checkout/stepper/stepper";
import { steps } from "@/components/checkout/stepper/stepper-config";
import { ItemLines } from "@/components/checkout/order-summary/item-lines";
import { getVerifiedPayment } from "@/utilities/payment";

export const metadata: Metadata = { title: "Order Confirmation", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const cardLogoBaseUrl = "https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons@178649510e25c3f08c6e3cdf2464c110b8a3ece4/flat-rounded";
const cardBrands: Record<string, { label: string; logo: string | null }> = {
  visa: { label: "Visa", logo: `${cardLogoBaseUrl}/visa.svg` },
  mastercard: { label: "Mastercard", logo: `${cardLogoBaseUrl}/mastercard.svg` },
  amex: { label: "American Express", logo: `${cardLogoBaseUrl}/amex.svg` },
  discover: { label: "Discover", logo: `${cardLogoBaseUrl}/discover.svg` },
  diners: { label: "Diners Club", logo: `${cardLogoBaseUrl}/diners.svg` },
  jcb: { label: "JCB", logo: `${cardLogoBaseUrl}/jcb.svg` },
  unionpay: { label: "UnionPay", logo: `${cardLogoBaseUrl}/unionpay.svg` },
};

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ transactionId?: string }> }) {
  const { transactionId } = await searchParams;
  if (typeof transactionId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(transactionId)) notFound();

  const [user, order] = await Promise.all([
    await getUser(),
    await getOrderDetailsAction(transactionId),
  ])
  const { error } = user;
  if (error || !user) redirect("/login");

  if (!order) return <InvalidOrderPage />;
  const verifiedPayment = await getVerifiedPayment(order.paymentId);
  const charge = verifiedPayment?.latest_charge && typeof verifiedPayment.latest_charge !== "string" ? verifiedPayment.latest_charge : null;
  const card = charge?.payment_method_details?.card;
  const cardBrand = card ? cardBrands[card.brand ?? "unknown"] ?? { label: "Card", logo: null } : null;
  const { orderNumber, orderItems, shippingDetails: address, deliveryOption: delivery } = order;
  const subtotal = getCartSubtotal(orderItems);
  const deliveryFee = computeDeliveryFee(delivery, subtotal);
  const total = subtotal + deliveryFee;
  const lines = [
    {
      label: "Shipping Fee",
      value: deliveryFee === 0 ? "Free" : deliveryFee,
    },
    { label: "Subtotal", value: subtotal }
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <ConfirmationControls orderNumber={orderNumber} />
        {/* <div className="border-b border-gray-200 py-6">
          <CheckoutStepper steps={steps} activeStep={steps.length} compact />
        </div> */}
        <div className="mt-8 grid items-start gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(18rem,1fr)] xl:gap-12">
          <div className="min-w-0 divide-y divide-gray-200 pt-5 sm:pt-8 md:col-start-1 md:row-start-1">
            <div className="grid gap-x-8 gap-y-8 pb-8 sm:grid-cols-2 sm:gap-y-4 md:grid-cols-1 md:gap-y-8 xl:grid-cols-2 xl:gap-y-4">
              <section aria-labelledby="confirmation-address" className="grid min-w-0 gap-4 sm:row-span-2 sm:grid-rows-subgrid md:row-span-1 md:grid-rows-[auto_auto] xl:row-span-2 xl:grid-rows-subgrid">
                <h2 id="confirmation-address" className="flex items-start gap-2 text-base font-semibold leading-6"><MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" /> Shipping Address</h2>
                <address className="break-words pl-7 text-sm not-italic leading-6 text-gray-600">
                  <p className="font-medium text-gray-900">{address.firstName} {address.lastName}</p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>{[address.city, address.state, address.postalCode].filter(Boolean).join(", ")}</p>
                  {address.country && <p>{address.country}</p>}
                  <p className="mt-3">{address.email}</p>
                  <p>{address.phone}</p>
                </address>
              </section>
              <section aria-labelledby="confirmation-delivery" className="grid min-w-0 gap-4 sm:row-span-2 sm:grid-rows-subgrid md:row-span-1 md:grid-rows-[auto_auto] xl:row-span-2 xl:grid-rows-subgrid">
                <h2 id="confirmation-delivery" className="flex items-start gap-2 text-base font-semibold leading-6"><Truck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" /> Delivery Method</h2>
                <div className="break-words pl-7 text-sm leading-6 text-gray-600">
                  <p className="font-medium text-gray-900">{delivery.title}</p>
                  <p>{delivery.description}</p>
                  <p className="mt-3">{deliveryFee === 0 ? "Free" : currency.format(deliveryFee / 100)}</p>
                </div>
              </section>
            </div>
            <section aria-labelledby="confirmation-payment" className="py-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="confirmation-payment" className="flex items-start gap-2 text-base font-semibold leading-6"><CreditCard aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" /> Payment Details</h2>
                {verifiedPayment && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/15"><CircleCheck aria-hidden="true" className="h-3.5 w-3.5" /> Paid</span>}
              </div>
              {verifiedPayment ? (
                <dl className="mt-6 grid min-w-0 gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:pl-7 md:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="min-w-0">
                    <dt className="text-xs font-medium text-gray-500">Payment method</dt>
                    <dd className="mt-2 flex min-w-0 items-center gap-3">
                      {card && cardBrand ? (
                        <>
                          <span className="inline-flex h-8 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-inset ring-gray-200">
                            {cardBrand.logo ? (
                              <Image src={cardBrand.logo} alt={`${cardBrand.label} logo`} width={48} height={32} unoptimized referrerPolicy="no-referrer" className="h-full w-full object-contain" />
                            ) : (
                              <CreditCard aria-hidden="true" className="h-5 w-5 text-gray-400" />
                            )}
                          </span>
                          <div className="min-w-0 text-sm leading-5">
                            <p className="font-semibold text-gray-900">{cardBrand.label}</p>
                            <p className="mt-0.5 text-gray-500">Ending in <span className="font-medium tabular-nums text-gray-700">{card.last4}</span></p>
                          </div>
                        </>
                      ) : (
                        <><CreditCard aria-hidden="true" className="h-5 w-5 shrink-0 text-gray-400" /><span className="text-sm font-medium text-gray-700">{charge?.payment_method_details?.type === "card" ? "Card" : "Online payment"}</span></>
                      )}
                    </dd>
                  </div>
                  <div className="min-w-0 border-t border-gray-100 pt-4 sm:max-w-56 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right md:max-w-none md:border-l-0 md:border-t md:pl-0 md:pt-4 md:text-left xl:max-w-56 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0 xl:text-right">
                    <dt className="text-xs font-medium text-gray-500">Amount paid</dt>
                    <dd className="mt-2 break-words text-xl font-semibold tabular-nums leading-7 text-gray-900">{new Intl.NumberFormat("en-US", { style: "currency", currency: verifiedPayment.currency }).format(verifiedPayment.amount_received / 100)}</dd>
                    <dd className="mt-1 text-xs uppercase text-gray-500">{verifiedPayment.currency}</dd>
                  </div>
                </dl>
              ) : <p className="mt-4 pl-7 text-sm leading-6 text-gray-600">Payment details are currently unavailable.</p>}
            </section>
            <div className="pt-8">
              <Link href="/shop" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"><ShoppingBag aria-hidden="true" className="h-4 w-4" /> Continue shopping</Link>
            </div>
          </div>
          <div className="min-w-0 self-start md:col-start-2 md:row-start-1">
            <OrderSummary id="confirmation-summary" headerContent={<CheckoutStepper steps={steps} activeStep={steps.length} compact />}>
              <OrderSummaryLines lines={lines} total={total} totalLabel="Total" >
                <ItemLines items={orderItems} />
              </OrderSummaryLines>
            </OrderSummary>
          </div>
        </div>
      </div>
    </main>
  );
}

function InvalidOrderPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section
          aria-labelledby="order-unavailable-title"
          aria-describedby="order-unavailable-description"
          className="border-y border-gray-200 bg-gray-50 px-6 py-16 sm:px-12 sm:py-20"
        >
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-indigo-600">
              <PackageSearch aria-hidden="true" className="h-8 w-8" />
            </div>
            <p id="order-unavailable-description" className="mt-3 text-sm leading-6 text-gray-600">
              We could not load this order. Check your order history to find your purchase, or try again later.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/orders"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
              >
                <ClipboardList aria-hidden="true" className="h-4 w-4 shrink-0" /> View orders
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
              >
                <ShoppingBag aria-hidden="true" className="h-4 w-4 shrink-0" />Continue shopping
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}