"use client"
import {
    createContext,
    useCallback,
    useRef,
    useState,
    useContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";
import { useSearchParams } from "next/navigation";
import { deliveryOptions, type IDeliveryOptions } from "@/components/checkout/delivery/delivery-config";
import { steps } from "@/components/checkout/stepper/stepper-config";
import type { ShippingAddress } from "@/components/checkout/shipping-address/types";
import { createPaymentIntent } from "@/app/actions/payment/create-payment-intent-action";

export enum PaymentStatus {
    loading = "loading",
    incomplete = "incomplete",
    ready = "ready",
    submitting = "submitting",
    processing = "processing",
    succeeded = "succeeded",
    error = "error",
}

interface CheckoutContextValue {
    activeStep: number;
    selectedDelivery: IDeliveryOptions;
    setSelectedDelivery: Dispatch<SetStateAction<IDeliveryOptions>>;
    nextStep: () => void;
    previousStep: () => void;
    goToPreviousStep: (step: number) => void;
    paymentStatus: PaymentStatus;
    setPaymentStatus: Dispatch<SetStateAction<PaymentStatus>>;
    initializePayment: () => ReturnType<typeof createPaymentIntent>;
    shippingAddress: ShippingAddress;
    saveShippingAddress: Dispatch<SetStateAction<ShippingAddress>>;
}

export const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export const useCheckout = () => {
    const checkout = useContext(CheckoutContext);
    if (!checkout) {
        throw new Error("useCheckout must be used within CheckoutProvider.");
    }
    return checkout;
};

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
    const transactionId = useSearchParams().get("transactionId");
    const [activeStep, setActiveStep] = useState(transactionId ? steps.length : 1);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    });
    const [selectedDelivery, setSelectedDelivery] = useState<IDeliveryOptions>(deliveryOptions[0]);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.loading);
    const paymentRequest = useRef<{
        key: string;
        promise: ReturnType<typeof createPaymentIntent>;
    } | null>(null);

    const initializePayment = useCallback(() => {
        const params = { deliveryOption: selectedDelivery, shippingAddress };
        const key = JSON.stringify(params);
        if (paymentRequest.current?.key === key) return paymentRequest.current.promise;

        const promise = createPaymentIntent({ ...params, requestId: crypto.randomUUID() });
        paymentRequest.current = { key, promise };
        void promise.catch(() => {
            if (paymentRequest.current?.promise === promise) paymentRequest.current = null;
        });
        return promise;
    }, [selectedDelivery, shippingAddress]);

    const nextStep = () => {
        setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    };

    const goToPreviousStep = (step: number) => {
        if (!Number.isInteger(step) || step <= 0) return;
        setActiveStep((current) => step < current ? step : current);
    };

    const previousStep = () => {
        goToPreviousStep(activeStep - 1);
    };

    return (
        <CheckoutContext.Provider
            value={{
                activeStep,
                selectedDelivery,
                setSelectedDelivery,
                nextStep,
                previousStep,
                goToPreviousStep,
                paymentStatus,
                setPaymentStatus,
                initializePayment,
                shippingAddress,
                saveShippingAddress: setShippingAddress,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};