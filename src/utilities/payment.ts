import "server-only";
import Stripe from "stripe";

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Payment is not configured yet.");
  return new Stripe(secretKey);
}

export async function getVerifiedPayment(paymentId: string | undefined) {
  if (!paymentId) return;
  if (!/^pi_[a-zA-Z0-9]+$/.test(paymentId)) {
    throw new Error("Invalid payment ID.");
  }
  const payment = await getStripeClient().paymentIntents.retrieve(paymentId, {
    expand: ["latest_charge"],
  });
  if (payment.status !== "succeeded") {
    throw new Error("Unable to verify your completed payment.");
  }
  return payment;
}
