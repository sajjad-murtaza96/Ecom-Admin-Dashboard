"use client";
import { useState, useTransition } from "react";
import { updateCartItemQuantityAction } from "@/app/actions/supabase/cart";
import { QuantitySelector } from "@/components/quantity-selector";
import { isValidCartQuantity, MAX_CART_QUANTITY } from "@/utilities/cart";
import { useCart } from "@/context/cart/provider";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface CartItemQuantityProps {
  itemId: string;
  quantity: number;
  productName: string;
  price: number;
}

export const CartItemQuantity = ({
  itemId,
  quantity,
  productName,
  price,
}: CartItemQuantityProps) => {
  const [message, setMessage] = useState("");
  const [isSaving, startTransition] = useTransition();
  const { items, updateOptimisticQuantity } = useCart();
  const optimisticQuantity =
    items.find((item) => item.id === itemId)?.quantity ?? quantity;

  const updateQuantity = (nextQuantity: number) => {
    if (isSaving) return;
    if (!isValidCartQuantity(nextQuantity)) {
      setMessage(
        `Quantity must be a whole number between 1 and ${MAX_CART_QUANTITY}.`,
      );
      return;
    }

    setMessage("");
    startTransition(async () => {
      try {
        updateOptimisticQuantity({ id: itemId, quantity: nextQuantity });
        await updateCartItemQuantityAction(itemId, nextQuantity);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to save your cart changes. Please try again.",
        );
      }
    });
  };

  return (
    <div
      aria-busy={isSaving}
      className="mt-4 flex flex-wrap items-center justify-between gap-3"
    >
      <QuantitySelector
        quantity={optimisticQuantity}
        productName={productName}
        max={MAX_CART_QUANTITY}
        disabled={isSaving}
        onChange={updateQuantity}
      >
        <p role="alert" className="mt-4 text-sm text-red-600">
          {message}
        </p>
      </QuantitySelector>
      <p className="font-semibold break-all">
        {currency.format((Math.round(price * 100) * optimisticQuantity) / 100)}
      </p>
    </div>
  );
};
