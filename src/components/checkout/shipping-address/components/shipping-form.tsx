"use client"
import { useCheckout } from "@/context/checkout/provider";
import type { ShippingAddress, ShippingField } from "../types";
import { MaskedInput } from "react-text-mask-modern";

const autoCompleteValues: Record<string, string> = {
  firstName: "given-name",
  lastName: "family-name",
  email: "email",
  addressLine1: "address-line1",
  addressLine2: "address-line2",
  phone: "tel",
  country: "country-name",
  city: "address-level2",
  postalCode: "postal-code",
  state: "address-level1"
};

const fieldClassName =
  "mt-1 block min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 placeholder:opacity-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

const phonePattern = String.raw`\+1 \([0-9]{3}\) [0-9]{3}-[0-9]{4}`;
const phoneMask = Array.from("+1 (___) ___-____", (character) =>
  character === "_" ? /[0-9]/ : character,
);

export const ShippingAddressForm: React.FC<{ field: ShippingField }> = ({ field }) => {
  const { shippingAddress, saveShippingAddress } = useCheckout();
  const handleChange = (fieldName: keyof ShippingAddress, value: string) => {
    saveShippingAddress((current) => ({ ...current, [fieldName]: value }));
  };

  return (
    <div
      key={field.name}
      className={
        field.name === "addressLine1" || field.name === "addressLine2" || field.name === "email"
          ? "sm:col-span-2"
          : ""
      }
    >
      <label
        htmlFor={`checkout-${field.name}`}
        className="block text-sm font-medium text-gray-700"
      >
        {field.label}
        {field.isRequired && <span aria-hidden="true"> *</span>}
      </label>
      {field.name === "phone" ? (
        <MaskedInput
          mask={phoneMask}
          guide
          showMask
          placeholderChar="_"
          id={`checkout-${field.name}`}
          name={field.name}
          type="tel"
          inputMode="tel"
          pattern={phonePattern}
          placeholder="+1 (___) ___-____"
          title="Use the format +1 (234) 123-1234"
          required={field.isRequired}
          value={shippingAddress[field.name] ?? ""}
          onChange={({ currentTarget: { value } }) =>
            handleChange(field.name, value)
          }
          className={`${fieldClassName} ${/[0-9]/.test(shippingAddress.phone.replace(/^\+1/, "")) ? "text-gray-900" : "text-gray-400"}`}
        />
      ) : (
        <input
          id={`checkout-${field.name}`}
          name={field.name}
          type={field.type}
          autoComplete={autoCompleteValues[field.name]}
          required={field.isRequired}
          value={shippingAddress[field.name] ?? ""}
          onChange={(event) => handleChange(field.name, event.currentTarget.value)}
          className={`${fieldClassName} text-gray-900`}
        />
      )}
    </div>
  );
};

export default ShippingAddressForm;