import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { z } from "zod";
import { getCartByUserIdAction, getCartItemsAction } from "@/app/actions/supabase/cart";
import { deliveryOptions } from "@/components/checkout/delivery/delivery-config";
import { getCartSubtotal, isValidCartQuantity } from "@/utilities/cart";
import { getUser } from "@/db/supabase/query";
import { serializeOrderSnapshot, shippingAddressSchema } from "@/utilities/order";

export const runtime = "nodejs";

const paymentRequest = z.object({
  deliveryOption: z.enum(["standard", "express", "international"]),
  requestId: z.uuid(),
  shippingAddress: shippingAddressSchema,
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request." },
      { status: 400 },
    );
  }

  const result = paymentRequest.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Provide a valid shipping address, delivery option, and payment request ID." },
      { status: 400 },
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payment is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const { data: { user }, error: authError } = await getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Please sign in before paying." }, { status: 401 });
    }
    const cart = await getCartByUserIdAction();
    if (!cart) {
      return NextResponse.json({ error: "Sign in and add items to your cart before paying." }, { status: 401 });
    }
    const items = await getCartItemsAction(cart.id);
    if (!items.length || items.some((item) =>
      !isValidCartQuantity(item.quantity) ||
      !Number.isFinite(item.products.price) ||
      item.products.price < 0
    )) {
      return NextResponse.json({ error: "Your cart is empty or contains invalid items." }, { status: 400 });
    }
    const delivery = deliveryOptions.find((option) => option.id === result.data.deliveryOption);
    if (!delivery) {
      return NextResponse.json({ error: "Select a valid delivery option." }, { status: 400 });
    }
    const amount = getCartSubtotal(items) + delivery.priceCents;
    if (!Number.isSafeInteger(amount) || amount < 50 || amount > 99999999) {
      return NextResponse.json({ error: "The order amount is outside the supported payment range." }, { status: 400 });
    }
    const snapshotMetadata = serializeOrderSnapshot({
      shippingAddress: result.data.shippingAddress,
      items: items.map(({ products, quantity }) => ({
        name: products.name,
        quantity,
        unitAmount: Math.round(products.price * 100),
      })),
      delivery: { title: delivery.title, description: delivery.description, priceCents: delivery.priceCents },
    });
    if (!snapshotMetadata) {
      return NextResponse.json({ error: "This order is too large for online checkout. Please contact support." }, { status: 400 });
    }
    const stripe = new Stripe(secretKey);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      receipt_email: result.data.shippingAddress.email,
      metadata: { ...snapshotMetadata, userId: user.id, cartId: cart.id, deliveryOption: delivery.id },
    }, {
      idempotencyKey: `checkout-${cart.id}-${result.data.requestId}-${delivery.id}`,
    });
    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: "Unable to initialize payment." },
        { status: 502 },
      );
    }
    return NextResponse.json({ secretKey: paymentIntent.client_secret });
  } catch {
    return NextResponse.json(
      { error: "Unable to initialize payment. Please try again later." },
      { status: 502 },
    );
  }
}
