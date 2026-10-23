import { DeliveryOption } from "./components/delivery-option";
import { deliveryOptions, type DeliveryOptions } from "./delivery-config";

export const DeliveryService = ({
  selected,
  setSelectedAction,
}: {
  selected: DeliveryOptions;
  setSelectedAction: (option: DeliveryOptions) => void;
}) => {
  return (
    <section aria-labelledby="delivery-heading">
      <h2 id="delivery-heading" className="text-lg font-semibold">
        Delivery method
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Choose how quickly you would like your order delivered.
      </p>
      <fieldset className="mt-5 grid gap-3">
        <legend className="sr-only">Available delivery options</legend>
        {deliveryOptions.map((option) => (
          <DeliveryOption
            key={option.id}
            selected={selected}
            setSelected={setSelectedAction}
            option={option}
          />
        ))}
      </fieldset>
    </section>
  );
};
