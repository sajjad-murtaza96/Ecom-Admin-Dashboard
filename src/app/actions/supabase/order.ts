"use server";

import {
  createOrder,
  getOrderDetails,
  getOrderHistory,
  getUser,
} from "@/db/supabase/query";
import type { IOrderProps } from "@/utilities/order";

export async function createOrderAction(order: Omit<IOrderProps, "userId">) {
  const {
    data: { user },
    error: authError,
  } = await getUser();
  if (authError || !user) {
    throw new Error("Please sign in before creating an order.");
  }

  const { data, error } = await createOrder({ ...order, userId: user.id });
  if (error || !data) {
    throw new Error("Unable to create your order. Please try again.");
  }
  return data.transactionId;
}

export async function getOrderHistoryAction(user: { id: string }, page = 1) {
  if (!Number.isSafeInteger(page) || page < 1 || page > 1000000) {
    throw new Error("Invalid order history page.");
  }

  const pageSize = 10;
  const { data, error, count } = await getOrderHistory({
    userId: user.id,
    page,
    pageSize,
  });
  if (error || !data || count === null) {
    return;
  }
  return { orders: data, totalPages: Math.ceil(count / pageSize) };
}

export async function getOrderDetailsAction(
  transactionId: string,
): Promise<IOrderProps | undefined> {
  const { data, error } = await getOrderDetails({ transactionId });
  if (error || !data) {
    return;
  }
  return data;
}
