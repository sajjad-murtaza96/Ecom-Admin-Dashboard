import { CartItem } from "@/utilities/cart";
import { PaymentHeader } from "./components/payment-header";
import { PaymentMethod } from "./components/payment-method";

export default async function Payment({ cartId, items }: { cartId: string, items: CartItem[] }) {
  return (
    <section aria-labelledby="payment-heading" className="min-w-0 space-y-6">
      <PaymentHeader />
      <PaymentMethod cartId={cartId} items={items} />
    </section>
  );
};