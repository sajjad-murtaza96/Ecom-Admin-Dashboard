import { IDeliveryOptions } from "@/components/checkout/delivery/delivery-config";
import { ShippingAddress } from "@/components/checkout/shipping-address/types";
import { CartItem } from "./cart";

export interface IOrderProps {
  orderNumber: string;
  userId: string;
  orderItems: CartItem[];
  shippingDetails: ShippingAddress;
  deliveryOption: IDeliveryOptions;
  paymentId: string;
}

export interface IOrderHistoryItem {
  transactionId: string;
  orderNumber: string;
  createdAt: string;
  orderItems: CartItem[];
  deliveryOption: IDeliveryOptions;
  paymentId: string;
}
