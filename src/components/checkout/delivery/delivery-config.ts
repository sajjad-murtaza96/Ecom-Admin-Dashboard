import { Plane, Timer, Truck } from "lucide-react";

export interface IDeliveryOptions {
  id: DeliveryOptions;
  title: string;
  description: string;
  price: string;
  priceCents: number;
}

export const enum DeliveryOptions {
  DELIVERY_STANDARD = "standard",
  DELIVERY_EXPRESS = "express",
  DELIVERY_INTERNATIONAL = "international",
}

export const deliveryIcons = {
  [DeliveryOptions.DELIVERY_STANDARD]: Truck,
  [DeliveryOptions.DELIVERY_EXPRESS]: Timer,
  [DeliveryOptions.DELIVERY_INTERNATIONAL]: Plane,
};

export const deliveryOptions: IDeliveryOptions[] = [
  {
    id: DeliveryOptions.DELIVERY_STANDARD,
    title: "Standard Delivery",
    description: "5-10 business days",
    price: "Free",
    priceCents: 0,
  },
  {
    id: DeliveryOptions.DELIVERY_EXPRESS,
    title: "Express Delivery",
    description: "3-5 business days",
    price: "$9.99",
    priceCents: 999,
  },
  {
    id: DeliveryOptions.DELIVERY_INTERNATIONAL,
    title: "International Shipping",
    description: "1-2 business days",
    price: "$19.99",
    priceCents: 1999,
  },
];

export const subTotalThresholdForStandardDelivery = {
  subtotalThreshold: 50000,
  appliedPrice: "$2.99",
  appliedPriceCents: 299,
};
