"use client"
import {
    createContext,
    useState,
    useContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";
import { useSearchParams } from "next/navigation";
import { deliveryOptions, DeliveryOptions } from "@/components/checkout/delivery/delivery-config";
import { steps } from "@/components/checkout/stepper/stepper-config";
import type { ShippingAddress } from "@/components/checkout/shipping-address/types";

type PaymentStatus = "loading" | "incomplete" | "ready" | "submitting" | "processing" | "succeeded" | "error";

interface CheckoutContextValue {
    activeStep: number;
    selectedDelivery: DeliveryOptions;
    setSelectedDelivery: Dispatch<SetStateAction<DeliveryOptions>>;
    nextStep: () => void;
    previousStep: () => void;
    goToPreviousStep: (step: number) => void;
    paymentStatus: PaymentStatus;
    setPaymentStatus: Dispatch<SetStateAction<PaymentStatus>>;
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
    const searchParams = useSearchParams();
    const isPaymentReturn = searchParams.has("payment_intent_client_secret");
    const [activeStep, setActiveStep] = useState(isPaymentReturn ? steps.length - 1 : 0);
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
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOptions>(
        isPaymentReturn
            ? (deliveryOptions.find((option) => option.id === searchParams.get("delivery"))?.id ?? DeliveryOptions.DELIVERY_STANDARD)
            : DeliveryOptions.DELIVERY_STANDARD,
    );
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("loading");

    const nextStep = () => {
        setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    };

    const goToPreviousStep = (step: number) => {
        if (!Number.isInteger(step) || step < 0 || ["submitting", "processing", "succeeded"].includes(paymentStatus)) return;
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
                shippingAddress,
                saveShippingAddress: setShippingAddress,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};