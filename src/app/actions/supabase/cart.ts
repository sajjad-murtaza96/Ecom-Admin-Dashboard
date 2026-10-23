"use server";
import { revalidatePath } from "next/cache";
import {
  createCart,
  createCartItem,
  getCartByUserId,
  getCartItems,
  getUser,
  removeCartItem,
  updateCartItemQuantity,
} from "@/db/supabase/query";
import { type CartItem } from "@/utilities/cart";

export async function getCartByUserIdAction() {
  const {
    data: { user },
    error: authError,
  } = await getUser();
  if (authError || !user) {
    return;
  }

  const { data: cart, error: cartError } = await getCartByUserId(user.id);
  if (!cart || cartError) {
    return;
  }
  return cart;
}

export async function getCartItemsAction(cartId: string): Promise<CartItem[]> {
  const { data: items, error } = await getCartItems(cartId);
  if (!items || error) {
    return [];
  }
  return items;
}

export async function updateCartItemQuantityAction(
  itemId: string,
  quantity: number,
) {
  const { error } = await updateCartItemQuantity(itemId, quantity);
  if (error) {
    console.error(error);
    throw new Error("Unable to update your cart item. Please try again.");
  }
  revalidatePath("/cart");
}

export async function removeCartItemAction(itemId: string) {
  const { error } = await removeCartItem(itemId);
  if (error) {
    console.error(error);
    throw new Error("Unable to remove your cart item. Please try again.");
  }
  revalidatePath("/cart");
}

export async function createCartAction(productId: string, quantity: number) {
  const {
    data: { user },
    error: authError,
  } = await getUser();
  if (authError || !user) {
    throw new Error("Please sign in before creating a cart.");
  }
  const { data: result, error } = await createCart(user.id);
  if (error) {
    console.error(error);
    throw new Error("Unable to create your cart. Please try again.");
  }
  const { error: itemError } = await createCartItem(
    result.id,
    productId,
    quantity,
  );
  if (itemError) {
    console.error(itemError);
    throw new Error("Unable to add the item to your cart. Please try again.");
  }
  revalidatePath("/cart");
  return result;
}
