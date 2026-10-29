"use client";
import {
  OrderSummaryLines,
} from "@/components/order-summary";
import { useCart } from "@/context/cart/provider";
import { subTotalThresholdForStandardDelivery } from "@/components/checkout/delivery/delivery-config";

const lines = ({ itemCount, subtotal, isFreeShipping }: { itemCount: number; subtotal: number; isFreeShipping: boolean }) => [
  { label: `Items (${itemCount})`, value: subtotal },
  { label: "Shipping Fee", value: isFreeShipping ? "Free" : "Calculated at checkout" },
];

export const CartOrderSummaryLines = () => {
  const { items, subtotal } = useCart();
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  return (
    <>
      <OrderSummaryLines
        lines={lines({ itemCount, subtotal, isFreeShipping: subtotal >= subTotalThresholdForStandardDelivery.subtotalThreshold })}
        total={subtotal}
        totalLabel="Subtotal"
      />
    </>
  );
};
