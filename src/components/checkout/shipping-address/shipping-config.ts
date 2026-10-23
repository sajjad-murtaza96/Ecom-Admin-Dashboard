import type { ShippingFormConfiguration } from "./types";

const ShippingFormConfig: ShippingFormConfiguration = {
  fields: [
    { label: "First Name", name: "firstName", type: "text", isRequired: true },
    { label: "Last Name", name: "lastName", type: "text", isRequired: true },
    { label: "Email", name: "email", type: "email", isRequired: true },
    {
      label: "Address line 1",
      name: "addressLine1",
      type: "text",
      isRequired: true,
    },
    {
      label: "Address line 2",
      name: "addressLine2",
      type: "text",
      isRequired: false,
    },
    { label: "Phone", name: "phone", type: "tel", isRequired: true },
    { label: "Country", name: "country", type: "text", isRequired: false },
    { label: "City", name: "city", type: "text", isRequired: false },
    {
      label: "State / Province",
      name: "state",
      type: "text",
      isRequired: false,
    },
    {
      label: "Postal Code",
      name: "postalCode",
      type: "text",
      isRequired: false,
    },
  ],
};
export default ShippingFormConfig;
