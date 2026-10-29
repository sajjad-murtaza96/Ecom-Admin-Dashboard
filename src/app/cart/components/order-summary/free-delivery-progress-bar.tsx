"use client";
import { CircleCheck, Truck } from "lucide-react";
import { useCart } from "@/context/cart/provider";
import { subTotalThresholdForStandardDelivery } from "@/components/checkout/delivery/delivery-config";
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const FreeDeliveryProgressBar = () => {
  const { subtotal } = useCart();
  const threshold = subTotalThresholdForStandardDelivery.subtotalThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, Math.max(0, subtotal / threshold * 100));
  const deliveryStatusMessage = remaining === 0
    ? "You've unlocked free standard delivery!"
    : `Add ${currency.format(remaining / 100)} for free standard delivery.`;
  const DeliveryIcon = remaining === 0 ? CircleCheck : Truck;
  return (
    <div className="mt-5 min-w-0 border-b border-gray-200 pb-5">
      <p role="status" aria-atomic="true" className={`flex items-start gap-2 text-sm font-medium leading-5 ${remaining === 0 ? "text-emerald-700" : "text-gray-700"}`}>
        <DeliveryIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 break-words">{deliveryStatusMessage}</span>
      </p>
      <div
        role="progressbar"
        aria-label="Free standard delivery"
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-valuenow={Math.min(threshold, Math.max(0, subtotal))}
        aria-valuetext={deliveryStatusMessage}
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div className={`h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none ${remaining === 0 ? "bg-emerald-600" : "bg-indigo-600"}`} style={{ width: `${progress}%` }} />
      </div>
      <div aria-hidden="true" className="mt-2 flex justify-between text-xs tabular-nums text-gray-500">
        <span>{currency.format(0)}</span>
        <span>{currency.format(threshold / 100)}</span>
      </div>
    </div>
  )
}