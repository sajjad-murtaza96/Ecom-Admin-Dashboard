import ShippingFormConfig from "./shipping-config";
import ShippingAddressForm from "./components/shipping-form";

export const ShippingAddress: React.FC = () => {
  const { fields } = ShippingFormConfig;
  return (
    <form
      id="checkout-shipping-form"
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Shipping information</h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter the address where your order should be delivered.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <ShippingAddressForm
            key={field.name}
            field={field}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">* Required fields</p>
    </form>
  );
};
