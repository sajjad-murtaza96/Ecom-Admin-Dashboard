"use client"
import { PaymentError } from "./error-boundary";
import { PaymentStatus, useCheckout } from "@/context/checkout/provider";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { PaymentForm } from "./payment-form";
import { PAYMENT_ERROR_MESSAGE } from "../config";
import { CartItem } from "@/utilities/cart";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripe = publishableKey ? loadStripe(publishableKey) : null;
const appearance: Appearance = {
	theme: "stripe",
	variables: {
		colorPrimary: "#4f46e5",
		colorBackground: "#ffffff",
		colorText: "#111827",
		colorTextSecondary: "#6b7280",
		colorDanger: "#dc2626",
		fontSizeBase: "14px",
		spacingUnit: "4px",
		borderRadius: "6px",
	},
	rules: {
		".AccordionItem": {
			border: "1px solid #e5e7eb",
			boxShadow: "none",
		},
		".AccordionItem--selected": {
			borderColor: "#4f46e5",
			boxShadow: "0 0 0 1px #4f46e5",
		},
		".Label": {
			color: "#374151",
			fontWeight: "500",
			marginBottom: "6px",
		},
		".Input": {
			border: "1px solid #d1d5db",
			boxShadow: "none",
			padding: "12px",
		},
		".Input:focus": {
			borderColor: "#4f46e5",
			boxShadow: "0 0 0 3px #eef2ff",
		},
	},
};

export const PaymentMethod: React.FC<{ cartId: string, items: CartItem[] }> = ({ cartId, items }) => {
	const [clientSecret, setClientSecret] = useState("");
	const { initializePayment, paymentStatus, setPaymentStatus } = useCheckout();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!stripe) return;
		let active = true;
		const loadPayment = async () => {
			setPaymentStatus(PaymentStatus.loading);
			setError(null);
			setClientSecret("");
			try {
				const response = await initializePayment();
				if (!active) return;
				if (!response.clientSecret) {
					throw new Error("Unable to create payment intent.");
				}
				setClientSecret(response.clientSecret);
				setPaymentStatus(PaymentStatus.incomplete);
			} catch (error) {
				if (!active) return;
				setError(error instanceof Error ? error.message : PAYMENT_ERROR_MESSAGE.default);
				setPaymentStatus(PaymentStatus.error);
			}
		};
		void loadPayment();
		return () => { active = false; };
	}, [initializePayment, setPaymentStatus]);


	return (
		<PaymentError stripe={stripe} error={error} paymentStatus={paymentStatus} clientSecret={clientSecret}>
			<Elements key={clientSecret} stripe={stripe} options={{ clientSecret, appearance: appearance }}>
				<PaymentForm cartId={cartId} items={items} paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus} error={error} setError={setError} />
			</Elements>
		</PaymentError>
	);
}