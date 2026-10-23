"use client";
import { type ReactNode } from "react";
import { useCheckout } from "@/context/checkout/provider";
import { ContinueCheckout } from "./continue-checkout";
import { DeliveryService } from "./delivery";
import { CheckoutStepper } from "./stepper/stepper";
import { steps } from "./stepper/stepper-config";

export const CheckoutSteps = ({ shipping, payment }: { shipping: ReactNode; payment: ReactNode }) => {
  const {
    activeStep,
    selectedDelivery,
    setSelectedDelivery,
    nextStep,
    previousStep,
    goToPreviousStep,
    paymentStatus,
  } = useCheckout();

  const handleNext = () => {
    if (activeStep === 0) {
      const shippingForm = document.querySelector<HTMLFormElement>(
        "#checkout-shipping-form",
      );
      if (!shippingForm?.reportValidity()) return;
    }
    nextStep();
  };

  return (
    <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
      <CheckoutStepper
        steps={steps}
        activeStep={activeStep}
        onStepSelect={goToPreviousStep}
        disabled={["submitting", "processing", "succeeded"].includes(paymentStatus)}
      />
      <div className="mt-10 min-h-64">
        {activeStep === 0 && shipping}
        {activeStep === 1 && (
          <DeliveryService
            selected={selectedDelivery}
            setSelectedAction={setSelectedDelivery}
          />
        )}
        {activeStep === 2 && payment}
      </div>
      <ContinueCheckout
        activeStep={activeStep}
        isLastStep={activeStep === steps.length - 1}
        handleNext={handleNext}
        handlePrev={previousStep}
      />
    </section>
  );
}