import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { z } from "zod";
import {
  getCartByUserIdAction,
  getCartItemsAction,
} from "@/app/actions/supabase/cart";
import { getCartSubtotal, isValidCartQuantity } from "@/utilities/cart";
import { getUser } from "@/db/supabase/query";
import {
  computeDeliveryFee,
  shippingAddressSchema,
  deliveryOptionsSchema,
} from "@/utilities/checkout";

const paymentRequest = z.object({
  deliveryOption: deliveryOptionsSchema,
  requestId: z.uuid(),
  shippingAddress: shippingAddressSchema,
});

export async function POST(request: Request) {
  const data = await request.json();
  if (!data) {
    return NextResponse.json(
      { error: "Invalid JSON request." },
      { status: 400 },
    );
  }
  const result = paymentRequest.safeParse(data);
  if (!result.success) {
    return NextResponse.json(
      {
        error:
          "Provide a valid shipping address, delivery option, and payment request ID.",
      },
      { status: 400 },
    );
  }

  const {
    data: { shippingAddress, deliveryOption },
  } = result;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payment is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const {
      data: { user },
      error: authError,
    } = await getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Please sign in before paying." },
        { status: 401 },
      );
    }
    const cart = await getCartByUserIdAction();
    if (!cart) {
      return NextResponse.json(
        { error: "Sign in and add items to your cart before paying." },
        { status: 401 },
      );
    }
    const items = await getCartItemsAction(cart.id);
    if (
      !items.length ||
      items.some(
        (item) =>
          !isValidCartQuantity(item.quantity) ||
          !Number.isFinite(item.products.price) ||
          item.products.price < 0,
      )
    ) {
      return NextResponse.json(
        { error: "Your cart is empty or contains invalid items." },
        { status: 400 },
      );
    }

    if (!deliveryOption) {
      return NextResponse.json(
        { error: "Select a valid delivery option." },
        { status: 400 },
      );
    }
    const subtotal = getCartSubtotal(items);
    const deliveryFee = computeDeliveryFee(deliveryOption, subtotal);
    const amount = subtotal + deliveryFee;
    if (!Number.isSafeInteger(amount)) {
      return NextResponse.json(
        { error: "The order amount is outside the supported payment range." },
        { status: 400 },
      );
    }
    // const snapshotMetadata = serializeOrderSnapshot({
    //   shippingAddress: result.data.shippingAddress,
    //   items: items.map(({ products, quantity }) => ({
    //     name: products.name,
    //     quantity,
    //     unitAmount: Math.round(products.price * 100),
    //   })),
    //   delivery: { title: deliveryOption.title, description: deliveryOption.description, priceCents: deliveryOption.priceCents },
    // });
    // if (!snapshotMetadata) {
    //   return NextResponse.json({ error: "This order is too large for online checkout. Please contact support." }, { status: 400 });
    // }
    const stripe = new Stripe(secretKey);
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency: "usd",
        receipt_email: shippingAddress.email,
        amount_details: {
          line_items: items.map(({ products, quantity }) => ({
            product_name: products.name,
            quantity,
            unit_cost: Math.round(products.price * 100),
          })),
          shipping: {
            amount: deliveryFee,
          },
        },
        shipping: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          address: {
            line1: shippingAddress.addressLine1,
            line2: shippingAddress.addressLine2 ?? "",
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
          phone: shippingAddress.phone ?? "",
        },
        allowed_payment_method_types: ["card"],
      },
      {
        idempotencyKey: `checkout-${cart.id}-${result.data.requestId}-${deliveryOption.id}`,
      },
    );
    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: "Unable to initialize payment." },
        { status: 502 },
      );
    }
    return NextResponse.json({ secretKey: paymentIntent.client_secret });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error("Payment intent creation failed.", {
        type: error.type,
        code: error.code,
        param: error.param,
        requestId: error.requestId,
      });
    } else {
      console.error("Payment initialization failed.", {
        type: error instanceof Error ? error.name : "UnknownError",
      });
    }
    return NextResponse.json(
      { error: "Unable to initialize payment. Please try again later." },
      { status: 502 },
    );
  }
}
