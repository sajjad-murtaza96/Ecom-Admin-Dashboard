"use server"
import { headers } from "next/headers";
import type { ShippingAddress } from "@/components/checkout/shipping-address/types";
import { getProtocolAndHost } from "@/utilities/fetchDomain";
import type { IDeliveryOptions } from "@/components/checkout/delivery/delivery-config";

export const createPaymentIntent = async (params: {
  deliveryOption: IDeliveryOptions;
  requestId: string | null;
  shippingAddress: ShippingAddress;
}): Promise<{
  clientSecret: string;
}> => {
  const requestHeaders = await headers();
  const { protocol, host } = getProtocolAndHost(requestHeaders);
  const response = await fetch(
    new URL("/api/create-payment-intent", `${protocol}://${host}`),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: requestHeaders.get("cookie") ?? "",
      },
      body: JSON.stringify(params),
      cache: "no-store",
    },
  );
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Payment service is unavailable. Please try again later.");
  }
  const data: unknown = await response.json();
  if (!data || typeof data !== "object") {
    throw new Error("Invalid payment intent response.");
  }
  if (!response.ok) {
    throw new Error(
      "error" in data && typeof data.error === "string"
        ? data.error
        : "Unable to create payment intent.",
    );
  }
  if (!("secretKey" in data) || typeof data.secretKey !== "string" || !data.secretKey) {
    throw new Error("Invalid payment intent response.");
  }
  return { clientSecret: data.secretKey };
};
