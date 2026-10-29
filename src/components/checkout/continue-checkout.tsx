"use client";
import { useCheckout, PaymentStatus } from "@/context/checkout/provider";
import { LoaderCircle } from "lucide-react";

export const ContinueCheckout = ({
  activeStep,
  isLastStep,
  handleNextAction,
  handlePrevAction,
}: {
  activeStep: number;
  isLastStep: boolean;
  handleNextAction: () => void;
  handlePrevAction: () => void;
}) => {
  const { paymentStatus } = useCheckout();
  const isPaymentBusy = paymentStatus === PaymentStatus.submitting || paymentStatus === PaymentStatus.processing;

  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between">
      {activeStep > 1 ? (
        <button
          type="button"
          onClick={handlePrevAction}
          disabled={isLastStep && isPaymentBusy}
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
          disabled={paymentStatus !== PaymentStatus.ready}
          aria-busy={isPaymentBusy}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        >
          Submit Order
          {isPaymentBusy && <LoaderCircle aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" />}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNextAction}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-auto"
        >
          Continue
        </button>
      )}
    </div>
  );
};
