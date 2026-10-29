"use client";
import { Children, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PaymentStatus, useCheckout } from "@/context/checkout/provider";
import { ContinueCheckout } from "./continue-checkout";
import { CheckoutStepper } from "./stepper/stepper";
import { steps } from "./stepper/stepper-config";

export const CheckoutSteps = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const {
    activeStep,
    nextStep,
    previousStep,
    goToPreviousStep,
    paymentStatus,
  } = useCheckout();

  const handleStepSelect = (step: number) => {
    if (step === 0) {
      router.push("/cart");
      return;
    }
    goToPreviousStep(step);
  };

  const handleNext = () => {
    if (activeStep === 1) {
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
        onStepSelectAction={handleStepSelect}
        disabled={[PaymentStatus.submitting, PaymentStatus.processing].includes(paymentStatus)}
      />
      <div className="mt-10 min-h-64">
        {Children.toArray(children)[activeStep - 1]}
      </div>
      <ContinueCheckout
        activeStep={activeStep}
        isLastStep={activeStep === steps.length - 1}
        handleNextAction={handleNext}
        handlePrevAction={previousStep}
      />
    </section>
  );
}