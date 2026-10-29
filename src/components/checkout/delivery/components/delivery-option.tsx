"use client";
import { useCheckout } from "@/context/checkout/provider";
import { deliveryIcons, type IDeliveryOptions } from "../delivery-config";
import { computeDeliveryFee } from "@/utilities/checkout";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const DeliveryOption = ({
  option,
  subtotal
}: {
  option: IDeliveryOptions;
  subtotal: number;
}) => {
  const { selectedDelivery, setSelectedDelivery } = useCheckout();

  const Icon = deliveryIcons[option.id];
  const isActive = selectedDelivery.id === option.id;
  const deliveryFee = computeDeliveryFee(option, subtotal);

  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition ${isActive
        ? "border-indigo-600 bg-indigo-50"
        : "border-gray-200 bg-white hover:border-indigo-300"
        }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
          <Icon aria-hidden="true" className="h-5 w-5 text-indigo-600" />
        </span>
        <span className="min-w-0">
          <span className="block font-medium text-gray-900">{option.title}</span>
          <span className="mt-1 block text-sm text-gray-600">
            {option.description}
          </span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-semibold text-gray-800">
          {deliveryFee === 0 ? "Free" : currency.format(deliveryFee / 100)}
        </span>
        <input
          type="radio"
          name="delivery-option"
          value={option.id}
          checked={isActive}
          onChange={() => setSelectedDelivery(option)}
          className="h-4 w-4 accent-indigo-600"
          aria-label={option.title}
        />
      </span>
    </label>
  );
};
