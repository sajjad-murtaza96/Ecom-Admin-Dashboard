import {
  IDeliveryOptions,
  DeliveryOptions,
  subTotalThresholdForStandardDelivery,
} from "@/components/checkout/delivery/delivery-config";
import { z } from "zod";

export const shippingAddressSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  phone: z.string().trim().min(1).max(40),
  addressLine1: z.string().trim().min(1).max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100),
  state: z.string().trim().max(100),
  postalCode: z.string().trim().max(30),
  country: z.string().trim().max(100),
});

export const deliveryOptionsSchema = z.object({
  id: z.enum([
    DeliveryOptions.DELIVERY_STANDARD,
    DeliveryOptions.DELIVERY_EXPRESS,
    DeliveryOptions.DELIVERY_INTERNATIONAL,
  ]),
  title: z.string(),
  description: z.string(),
  price: z.string(),
  priceCents: z.number(),
});

export const computeDeliveryFee = (
  selectedDeliveryOption: IDeliveryOptions | undefined,
  subtotal: number,
): number => {
  if (!selectedDeliveryOption) return 0;
  if (
    selectedDeliveryOption.id === DeliveryOptions.DELIVERY_STANDARD &&
    subtotal < subTotalThresholdForStandardDelivery.subtotalThreshold
  ) {
    return subTotalThresholdForStandardDelivery.appliedPriceCents;
  }
  return selectedDeliveryOption.priceCents;
};
