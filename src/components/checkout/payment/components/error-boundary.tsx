import { Stripe } from "@stripe/stripe-js";
import { Loader } from "./loader";
import { PAYMENT_ERROR_MESSAGE } from "../config";

export const PaymentError: React.FC<{ stripe: Promise<Stripe | null> | null; error: string | null; clientSecret: string; children: React.ReactNode }> = ({ stripe, error, clientSecret, children }) => {
	return (
		<div>
			{!stripe || error && (
				<p role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					{error || PAYMENT_ERROR_MESSAGE.paymentMethodsUnavailable}
				</p>
			)}
			{clientSecret ? (
				<>
					{children}
				</>
			) : (
				<Loader />
			)}
		</div>
	);
};