"use client";

import { useCheckout } from "@/context/checkout/provider";

export const ContinueCheckout = ({
  activeStep,
  isLastStep,
  handleNext,
  handlePrev,
}: {
  activeStep: number;
  isLastStep: boolean;
  handleNext: () => void;
  handlePrev: () => void;
}) => {
  const { paymentStatus } = useCheckout();
  const paymentLocked = ["submitting", "processing", "succeeded"].includes(paymentStatus);

  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between">
      {activeStep > 0 ? (
        <button
          type="button"
          onClick={handlePrev}
          disabled={isLastStep && paymentLocked}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>
      ) : (
        <span />
      )}
      {isLastStep ? (
        <button
          type="submit"
          form="checkout-payment-form"
          disabled={paymentStatus !== "ready"}
          aria-busy={paymentStatus === "submitting"}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        >
          {paymentStatus === "submitting"
            ? "Submitting..."
            : paymentStatus === "succeeded"
              ? "Payment received"
              : paymentStatus === "processing"
                ? "Payment processing"
                : "Submit order"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-auto"
        >
          Continue
        </button>
      )}
    </div>
  );
};
