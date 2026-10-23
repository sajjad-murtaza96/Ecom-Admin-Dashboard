import type { HTMLInputTypeAttribute } from "react";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingField {
  label: string;
  name: keyof ShippingAddress;
  type: HTMLInputTypeAttribute;
  isRequired: boolean;
}

export interface ShippingFormConfiguration {
  fields: ShippingField[];
}
