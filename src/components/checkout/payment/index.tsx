"use client";

import { PaymentElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Appearance, type StripePaymentElementOptions } from "@stripe/stripe-js";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/checkout/provider";
import { Loader } from "./components/loader";
import { PaymentHeader } from "./components/payment-header";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripe = publishableKey ? loadStripe(publishableKey) : null;

const appearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#4f46e5",
    colorBackground: "#ffffff",
    colorText: "#111827",
    colorTextSecondary: "#6b7280",
    colorDanger: "#dc2626",
    fontSizeBase: "14px",
    spacingUnit: "4px",
    borderRadius: "6px",
  },
  rules: {
    ".AccordionItem": {
      border: "1px solid #e5e7eb",
      boxShadow: "none",
    },
    ".AccordionItem--selected": {
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 1px #4f46e5",
    },
    ".Label": {
      color: "#374151",
      fontWeight: "500",
      marginBottom: "6px",
    },
    ".Input": {
      border: "1px solid #d1d5db",
      boxShadow: "none",
      padding: "12px",
    },
    ".Input:focus": {
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px #eef2ff",
    },
  },
};

const paymentOptions: StripePaymentElementOptions = {
  layout: {
    type: "accordion",
    defaultCollapsed: false,
    radios: "always",
    spacedAccordionItems: true,
  },
};

export const Payment = () => {
  const router = useRouter();
  const { selectedDelivery, shippingAddress, paymentStatus, setPaymentStatus } = useCheckout();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef<string | null>(null);

  useEffect(() => {
    if (!stripe) return;
    const controller = new AbortController();
    requestId.current ??= crypto.randomUUID();

    async function initializePayment() {
      setPaymentStatus("loading");
      setError(null);
      setClientSecret("");
      try {
        const query = new URLSearchParams(window.location.search);
        const returnedSecret = query.get("payment_intent_client_secret");
        if (returnedSecret && (query.get("delivery") ?? "standard") === selectedDelivery) {
          const stripeClient = await stripe;
          if (!stripeClient) throw new Error("Unable to load Stripe.");
          const result = await stripeClient.retrievePaymentIntent(returnedSecret);
          if (controller.signal.aborted) return;
          if (result.error) throw new Error(result.error.message || "Unable to verify payment.");
          const status = result.paymentIntent?.status;
          if (status === "succeeded" || status === "processing") {
            setPaymentStatus(status);
            router.replace(`/checkout/confirmation?payment_intent=${encodeURIComponent(result.paymentIntent.id)}`);
            return;
          }
          if (status !== "requires_payment_method" && status !== "requires_confirmation" && status !== "requires_action") {
            throw new Error("This payment cannot be completed. Please restart checkout.");
          }
          setClientSecret(returnedSecret);
          setPaymentStatus("incomplete");
          return;
        }

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deliveryOption: selectedDelivery, shippingAddress, requestId: requestId.current }),
          signal: controller.signal,
        });
        if (!response.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Payment service is unavailable. Please try again later.");
        }
        const data = await response.json();
        if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Unable to load payment.");
        if (typeof data.secretKey !== "string" || !data.secretKey) throw new Error("Invalid payment response.");
        if (!controller.signal.aborted) {
          setClientSecret(data.secretKey);
          setPaymentStatus("incomplete");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error instanceof Error ? error.message : "Unable to load payment.");
          setPaymentStatus("error");
        }
      }
    }

    void initializePayment();
    return () => controller.abort();
  }, [selectedDelivery, shippingAddress, setPaymentStatus, router]);

  return (
    <section aria-labelledby="payment-heading" className="min-w-0 space-y-6">
      <PaymentHeader />
      {!stripe || error ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Payment is not configured yet."}
        </p>
      ) : paymentStatus === "succeeded" ? (
        <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Your payment was received successfully.
        </p>
      ) : paymentStatus === "processing" ? (
        <p role="status" className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800">
          Your payment is processing. Do not submit another payment.
        </p>
      ) : clientSecret ? (
        <Elements key={clientSecret} stripe={stripe} options={{ clientSecret, appearance }}>
          <PaymentForm />
        </Elements>
      ) : (
        <Loader />
      )}
    </section>
  );
};

function PaymentForm() {
  const router = useRouter();
  const stripeClient = useStripe();
  const elements = useElements();
  const { paymentStatus, setPaymentStatus } = useCheckout();
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripeClient || !elements || paymentStatus !== "ready" || submitting.current) return;
    submitting.current = true;
    setPaymentStatus("submitting");
    setError(null);

    try {
      const returnUrl = new URL("/checkout/confirmation", window.location.origin);
      const result = await stripeClient.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl.toString() },
        redirect: "if_required",
      });
      if (result.error) {
        setError(result.error.message || "Payment failed. Please check your details.");
        setPaymentStatus("ready");
      } else if (result.paymentIntent?.status === "succeeded" || result.paymentIntent?.status === "processing") {
        setPaymentStatus(result.paymentIntent.status);
        router.replace(`/checkout/confirmation?payment_intent=${encodeURIComponent(result.paymentIntent.id)}`);
      } else {
        setError("Payment was not completed. Please review your payment details.");
        setPaymentStatus("incomplete");
      }
    } catch {
      setError("Unable to confirm payment. Check your connection and try again.");
      setPaymentStatus("ready");
    } finally {
      submitting.current = false;
    }
  }

  return (
    <form id="checkout-payment-form" onSubmit={handleSubmit} className="space-y-4" aria-busy={paymentStatus === "submitting"}>
      <PaymentElement
        options={paymentOptions}
        onChange={(event) => {
          if (paymentStatus !== "submitting") {
            setPaymentStatus(event.complete ? "ready" : "incomplete");
            setError(null);
          }
        }}
        onLoadError={(event) => {
          setError(event.error.message || "Unable to load payment methods.");
          setPaymentStatus("error");
        }}
      />
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </form>
  );
}