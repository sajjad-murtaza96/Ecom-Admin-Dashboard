"use client";
import { createContext, useContext, useOptimistic, type ReactNode } from "react";
import { getCartSubtotal, type CartItem } from "@/utilities/cart";

interface CartContextValue {
    items: CartItem[];
    subtotal: number;
    updateOptimisticQuantity: (update: Pick<CartItem, "id" | "quantity">) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({
    items,
    children,
}: {
    items: CartItem[];
    children: ReactNode;
}) => {
    const [optimisticItems, updateOptimisticQuantity] = useOptimistic(
        items,
        (currentItems, update: Pick<CartItem, "id" | "quantity">) =>
            currentItems.map((item) =>
                item.id === update.id ? { ...item, quantity: update.quantity } : item,
            ),
    );

    return (
        <CartContext.Provider
            value={{
                items: optimisticItems,
                subtotal: getCartSubtotal(optimisticItems),
                updateOptimisticQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const cart = useContext(CartContext);
    if (!cart) throw new Error("useCart must be used within CartProvider.");
    return cart;
};