import "server-only";
import { createClient } from "./server";
import { cookies } from "next/headers";
import type { Cart, CartItem } from "@/utilities/cart";

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
