"use client";
import type { ReactNode } from "react";
import { OrderSummaryLines } from "@/components/order-summary";
import { useCheckout } from "@/context/checkout/provider";
import { computeDeliveryFee } from "@/utilities/checkout";

const lines = (activeStep: number, deliveryPrice: number, subtotal: number) => {
	const showDeliveryOnShippingStep = deliveryPrice === 0 ? "Free" : "Calculated at checkout"
	const deliveryFee = deliveryPrice === 0 ? "Free" : deliveryPrice;
	return [
		{
			label: "Shipping Fee",
			value: activeStep <= 1 ? showDeliveryOnShippingStep : deliveryFee,
		},
		{ label: "Subtotal", value: subtotal },
	];
}

export function CheckoutOrderSummaryLines({ subtotal, children }: { subtotal: number; children?: ReactNode }) {
	const { selectedDelivery, activeStep } = useCheckout();
	const deliveryPrice = computeDeliveryFee(selectedDelivery, subtotal);
	const estimatedTotal = activeStep <= 1 ? subtotal : subtotal + deliveryPrice;
	const estimatedTotalLabel = activeStep < 3 ? "Estimated Total" : "Total";

	return (
		<OrderSummaryLines
			lines={lines(activeStep, deliveryPrice, subtotal)}
			total={estimatedTotal}
			totalLabel={estimatedTotalLabel}
		>
			{children}
		</OrderSummaryLines>
	);
}