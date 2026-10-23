"use client";
import {
  OrderSummaryLines,
} from "@/components/order-summary";
import { useCart } from "@/context/cart/provider";

const lines = ({ itemCount, subtotal }: { itemCount: number; subtotal: number }) => [
  { label: `Items (${itemCount})`, value: subtotal },
  { label: "Shipping", value: "Not Applicable" },
];

export const CartTotals = () => {
  const { items, subtotal } = useCart();
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  return (
    <OrderSummaryLines
      lines={lines({ itemCount, subtotal })}
      total={subtotal}
      totalLabel="Subtotal"
    />
  );
};
