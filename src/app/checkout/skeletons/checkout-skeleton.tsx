import ShippingFormConfig from "@/components/checkout/shipping-address/shipping-config";
import { steps } from "@/components/checkout/stepper/stepper-config";

export default function CheckoutSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <div
        aria-hidden="true"
        className="mt-8 grid animate-pulse items-start gap-10 motion-reduce:animate-none lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)] lg:gap-16"
      >
        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="isolate grid auto-cols-fr grid-flow-col">
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex min-w-0 flex-col items-center px-1">
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-5 -z-10 h-0.5 w-full bg-gray-200" />
                )}
                <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
                <div className="mt-3 flex h-4 w-full justify-center sm:h-5">
                  <div className="h-full w-16 max-w-full rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 min-h-64 space-y-5">
            <div>
              <div className="h-7 w-48 max-w-full rounded bg-gray-200" />
              <div className="mt-1 h-5 w-full max-w-80 rounded bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ShippingFormConfig.fields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.name === "addressLine1" || field.name === "addressLine2" || field.name === "email"
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <div className="h-5 w-24 rounded bg-gray-200" />
                  <div className="mt-1 h-11 w-full rounded-md bg-gray-100" />
                </div>
              ))}
            </div>
            <div className="h-4 w-24 rounded bg-gray-100" />
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between">
            <span />
            <div className="h-11 w-full rounded-md bg-gray-200 sm:ml-auto sm:w-28" />
          </div>
        </div>

        <div className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-5 sm:p-8 lg:sticky lg:top-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="h-7 w-40 max-w-full rounded bg-gray-200" />
            <div className="h-5 w-14 shrink-0 rounded bg-gray-200" />
          </div>
          <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex justify-between gap-4 py-4">
                <div className="h-5 w-3/5 rounded bg-gray-200" />
                <div className="h-5 w-14 shrink-0 rounded bg-gray-200" />
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 text-sm">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className="flex flex-wrap justify-between gap-2">
                <div className="h-5 w-20 rounded bg-gray-200" />
                <div className="h-5 w-16 rounded bg-gray-200" />
              </div>
            ))}
            <div className="flex flex-wrap justify-between gap-2 border-t border-gray-200 pt-4">
              <div className="h-6 w-28 rounded bg-gray-200" />
              <div className="h-6 w-20 rounded bg-gray-200" />
            </div>
          </div>
          <div className="mt-4 h-5 w-full max-w-64 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}