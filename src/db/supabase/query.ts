import "server-only";
import { createClient } from "./server";
import { cookies } from "next/headers";
import type { Cart, CartItem } from "@/utilities/cart";
import type { IOrderProps, IOrderHistoryItem } from "@/utilities/order";
import { ShippingAddress } from "@/components/checkout/shipping-address/types";
import { IDeliveryOptions } from "@/components/checkout/delivery/delivery-config";

export async function getUser() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase.auth.getUser();
}

export async function getAllProducts() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase.from("products").select("*");
}

export async function getProductById(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase.from("products").select("*").eq("id", id).single();
}

export async function getCartByUserId(userId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase
    .from("cart")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle()
    .overrideTypes<Cart, { merge: false }>();
}

export async function createCart(userId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase
    .from("cart")
    .upsert({ user_id: userId }, { onConflict: "user_id" })
    .select("id")
    .single()
    .overrideTypes<Cart, { merge: false }>();
}

export async function getCartItems(cartId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase
    .from("cart_items")
    .select("id, quantity, products(id, name, price, image_url)")
    .eq("cart_id", cartId)
    .order("created_at")
    .order("id")
    .overrideTypes<CartItem[], { merge: false }>();
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase
    .from("cart_items")
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq("id", itemId);
}

export async function removeCartItem(itemId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase.from("cart_items").delete().eq("id", itemId);
}

export async function removeCartItems(cartId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase.from("cart_items").delete().eq("cart_id", cartId);
}

export async function createCartItem(
  cartId: string,
  productId: string,
  quantity: number,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase.rpc("add_cart_item", {
    p_cart_id: cartId,
    p_product_id: productId,
    p_quantity: quantity,
  });
}

export async function createOrder({
  orderNumber,
  userId,
  orderItems,
  shippingDetails,
  deliveryOption,
  paymentId,
}: {
  orderNumber: string;
  userId: string;
  orderItems: CartItem[];
  shippingDetails: ShippingAddress;
  deliveryOption: IDeliveryOptions;
  paymentId: string;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: userId,
      order_items: orderItems,
      shipping_details: shippingDetails,
      delivery_method: deliveryOption,
      payment_id: paymentId,
    })
    .select("transactionId:id")
    .single()
    .overrideTypes<{ transactionId: string }, { merge: false }>();
}

export async function getOrderHistory({
  userId,
  page,
  pageSize,
}: {
  userId: string;
  page: number;
  pageSize: number;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const offset = (page - 1) * pageSize;
  return await supabase
    .from("orders")
    .select(
      "transactionId:id, orderNumber:order_number, createdAt:created_at, orderItems:order_items, deliveryOption:delivery_method",
      { count: "exact" },
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + pageSize - 1)
    .overrideTypes<IOrderHistoryItem[], { merge: false }>();
}

export async function getOrderDetails({
  transactionId,
}: {
  transactionId: string;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  return await supabase
    .from("orders")
    .select(
      "orderNumber:order_number, userId:user_id, orderItems:order_items, shippingDetails:shipping_details, deliveryOption:delivery_method, paymentId:payment_id",
    )
    .eq("id", transactionId)
    .single()
    .overrideTypes<IOrderProps, { merge: false }>();
}
