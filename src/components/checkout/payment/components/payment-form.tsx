import { PaymentStatus, useCheckout } from "@/context/checkout/provider";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeError, StripePaymentElementChangeEvent, StripePaymentElementOptions } from "@stripe/stripe-js";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";
import { PAYMENT_ERROR_MESSAGE } from "../config";
import { createOrderAction } from "@/app/actions/supabase/order";
import { CartItem } from "@/utilities/cart";
import { removeCartItemsAction } from "@/app/actions/supabase/cart";

interface IPaymentFormProps {
	cartId: string;
	items: CartItem[];
	paymentStatus: PaymentStatus;
	setPaymentStatus: Dispatch<SetStateAction<PaymentStatus>>;
	error: string | null;
	setError: (error: string | null) => void;
}

const paymentOptions: StripePaymentElementOptions = {
	wallets: {
		link: "never",
	},
	layout: {
		type: "accordion",
		defaultCollapsed: false,
		radios: "always",
		spacedAccordionItems: true,
	},
};

export const PaymentForm: React.FC<IPaymentFormProps> = ({ cartId, items, paymentStatus, setPaymentStatus, error, setError }) => {
	const stripeClient = useStripe();
	const elements = useElements();
	const router = useRouter();
	const { shippingAddress, selectedDelivery } = useCheckout();
	const submitting = useRef(false);

	async function handleSubmitPayment(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!stripeClient || !elements || submitting.current) return;
		submitting.current = true;
		let errorMessage: string | null = null;
		let currentStatus: PaymentStatus = PaymentStatus.submitting;
		setPaymentStatus(currentStatus);
		setError(errorMessage);

		try {
			const returnUrl = new URL("/checkout/confirmation", window.location.origin);
			const { paymentIntent, error } = await stripeClient.confirmPayment({
				elements,
				confirmParams: {
					return_url: returnUrl.toString(),
					payment_method_data: {
						billing_details: {
							name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
							email: shippingAddress.email,
							phone: shippingAddress.phone,
						},
					},
				},
				redirect: "if_required",
			});

			if (error) {
				errorMessage = error.message || PAYMENT_ERROR_MESSAGE.default;
				return;
			}

			if (paymentIntent.id && paymentIntent?.status === PaymentStatus.succeeded) {
				try {
					const transactionId = await createOrderAction({
						orderNumber: crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase(),
						orderItems: items,
						shippingDetails: shippingAddress,
						deliveryOption: selectedDelivery,
						paymentId: paymentIntent.id,
					});
					await removeCartItemsAction(cartId);
					router.replace(`/checkout/confirmation?transactionId=${transactionId}`);
					return;
				}
				catch (error) {
					errorMessage = (error as Error)?.message || PAYMENT_ERROR_MESSAGE.default;
					currentStatus = PaymentStatus.error;
				}
			}

			errorMessage = PAYMENT_ERROR_MESSAGE.default;
			currentStatus = PaymentStatus.incomplete;
		} catch {
			errorMessage = PAYMENT_ERROR_MESSAGE.default;
			currentStatus = PaymentStatus.ready;
		} finally {
			setError(errorMessage);
			setPaymentStatus(currentStatus);
			submitting.current = false;
		}
	}

	const handlePaymentformChange = (event: StripePaymentElementChangeEvent) => {
		setPaymentStatus(event.complete ? PaymentStatus.ready : PaymentStatus.incomplete);
		setError(null);
	};

	const handleLoadError = (event: {
		elementType: "payment";
		error: StripeError;
	}) => {
		setError(event.error.message || PAYMENT_ERROR_MESSAGE.paymentMethodsUnavailable);
		setPaymentStatus(PaymentStatus.error);
	};
	return (
		<form id="checkout-payment-form" onSubmit={handleSubmitPayment} className="space-y-4" aria-busy={paymentStatus === PaymentStatus.submitting}>
			<PaymentElement
				options={paymentOptions}
				onChange={handlePaymentformChange}
				onLoadError={handleLoadError}
			/>
			{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
		</form>
	)
}