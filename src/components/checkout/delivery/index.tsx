import { Info } from "lucide-react";
import { DeliveryOption } from "./components/delivery-option";
import { deliveryOptions, subTotalThresholdForStandardDelivery } from "./delivery-config";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const DeliveryService: React.FC<{ subtotal: number }> = ({ subtotal }) => {
  return (
    <section aria-labelledby="delivery-heading">
      <h2 id="delivery-heading" className="text-lg font-semibold">
        Delivery Method
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Choose how quickly you would like your order delivered.
      </p>
      <fieldset className="mt-5 grid gap-3">
        <legend className="sr-only">Available delivery options</legend>
        {deliveryOptions.map((option) => (
          <DeliveryOption
            key={option.id}
            option={option}
            subtotal={subtotal}
          />
        ))}
      </fieldset>
      {subtotal < subTotalThresholdForStandardDelivery.subtotalThreshold && (
        <p className="mt-4 flex items-start gap-2 text-sm leading-5 text-gray-500">
          <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Avail free standard delivery on orders of {currency.format(subTotalThresholdForStandardDelivery.subtotalThreshold / 100)} or more.
          </span>
        </p>
      )}
    </section>
  );
};
