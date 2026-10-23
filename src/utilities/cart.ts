export const MAX_CART_QUANTITY = 10;

export interface Cart {
  id: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

export function isValidCartQuantity(quantity: unknown): quantity is number {
  return (
    typeof quantity === "number" &&
    Number.isSafeInteger(quantity) &&
    quantity >= 1 &&
    quantity <= MAX_CART_QUANTITY
  );
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce(
    (total, item) =>
      total +
      Math.round(item.products.price * 100) * item.quantity,
    0,
  );
}
