"use client"
import { CheckIcon } from "@heroicons/react/24/outline";
import type { IStep } from "./stepper-config";

export const CheckoutStepper = ({
  steps,
  activeStep,
  onStepSelectAction,
  disabled = false,
  compact = false,
}: {
  steps: IStep[];
  activeStep: number;
  onStepSelectAction?: (step: number) => void;
  disabled?: boolean;
  compact?: boolean;
}) => (
  <ol
    aria-label="Checkout progress"
    className="isolate grid auto-cols-fr grid-flow-col"
  >
    {steps.map((step, index) => {
      const isComplete = index < activeStep;
      const isCurrent = index === activeStep;

      return (
        <li
          key={step.title}
          aria-current={isCurrent ? "step" : undefined}
          className="relative flex min-w-0 flex-col items-center px-1 text-center"
        >
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className={`absolute left-1/2 -z-10 h-0.5 w-full ${compact ? "top-4" : "top-5"} ${isComplete ? "bg-emerald-500" : "bg-gray-200"
                }`}
            />
          )}
          <button
            type="button"
            disabled={!isComplete || disabled}
            onClick={() => onStepSelectAction?.(index)}
            aria-label={isComplete ? `Return to ${step.title}` : step.title}
            aria-current={isCurrent ? "step" : undefined}
            className="group flex w-full min-w-0 flex-col items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 disabled:cursor-default"
          >
            <span
              aria-hidden="true"
              className={`flex shrink-0 items-center justify-center rounded-full border-2 font-semibold ${compact ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"} ${isComplete
                ? "border-emerald-600 bg-emerald-600 text-white group-enabled:group-hover:border-emerald-700 group-enabled:group-hover:bg-emerald-700"
                : isCurrent
                  ? "border-indigo-600 bg-indigo-600 text-white ring-4 ring-indigo-100"
                  : "border-dashed border-gray-300 bg-white text-gray-400"
                }`}
            >
              {isComplete ? (
                <CheckIcon className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                index + 1
              )}
            </span>
            <span
              className={`w-full min-w-0 break-words font-semibold ${compact ? "mt-2 text-xs leading-5" : "mt-3 text-xs sm:text-sm"} ${isComplete
                ? "text-emerald-700"
                : isCurrent
                  ? "text-indigo-700"
                  : "text-gray-500"
                }`}
            >
              {step.title}
            </span>
          </button>
        </li>
      );
    })}
  </ol>
);
