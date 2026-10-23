import { Plane, Timer, Truck, type LucideIcon } from "lucide-react";

export interface IDeliveryOptions {
  id: DeliveryOptions;
  title: string;
  description: string;
  price: string;
  priceCents: number;
  icon: LucideIcon;
}

export const enum DeliveryOptions {
  DELIVERY_STANDARD = "standard",
  DELIVERY_EXPRESS = "express",
  DELIVERY_INTERNATIONAL = "international",
}

export const deliveryOptions: IDeliveryOptions[] = [
  {
    id: DeliveryOptions.DELIVERY_STANDARD,
    title: "Standard Delivery",
    description: "3-5 business days",
    price: "Free",
    priceCents: 0,
    icon: Truck,
  },
  {
    id: DeliveryOptions.DELIVERY_EXPRESS,
    title: "Express Delivery",
    description: "1-2 business days",
    price: "$9.99",
    priceCents: 999,
    icon: Timer,
  },
  {
    id: DeliveryOptions.DELIVERY_INTERNATIONAL,
    title: "International Shipping",
    description: "5-10 business days",
    price: "$19.99",
    priceCents: 1999,
    icon: Plane,
  },
];
