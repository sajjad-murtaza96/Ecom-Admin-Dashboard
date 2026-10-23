"use client";
import type { ReactNode } from "react";
import { OrderSummaryLines } from "@/components/order-summary";
import { deliveryOptions } from "../delivery/delivery-config";
import { useCheckout } from "@/context/checkout/provider";

export function CheckoutOrderSummaryLines({ subtotal, itemLines }: { subtotal: number; itemLines?: ReactNode }) {
    const { selectedDelivery, activeStep } = useCheckout();
    const selectedDeliveryOption = deliveryOptions.find(
        (option) => option.id === selectedDelivery,
    );
    const deliveryPrice = selectedDeliveryOption?.priceCents ?? 0;
    const estimatedTotal = activeStep === 0 ? subtotal : subtotal + deliveryPrice;
    const estimatedTotalLabel = activeStep < 2 ? "Estimated Total" : "Total";

    return (
        <OrderSummaryLines
            lines={[
                {
                    label: "Shipping",
                    value: activeStep === 0
                        ? "Not Applicable"
                        : selectedDeliveryOption?.price ?? 0,
                },
                { label: "Subtotal", value: subtotal },
            ]}
            total={estimatedTotal}
            totalLabel={estimatedTotalLabel}
        >
            {itemLines}
        </OrderSummaryLines>
    );
}