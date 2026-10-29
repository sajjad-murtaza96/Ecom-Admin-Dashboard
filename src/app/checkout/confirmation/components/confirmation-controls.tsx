"use client";
import { CircleCheck, Copy, Printer } from "lucide-react";
import { useState } from "react";
import styles from "./confirmation.module.css";

export function ConfirmationControls({ orderNumber }: { orderNumber: string }) {
  const [animation, setAnimation] = useState(0);

  return (
    <header className="border-b border-gray-200 pb-8 sm:pb-10">
      <button
        type="button"
        title="Replay confirmation animation"
        aria-label="Replay confirmation animation"
        onClick={() => setAnimation((current) => current + 1)}
        className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-600"
      >
        <CircleCheck key={animation} aria-hidden="true" className={`h-11 w-11 ${styles.check}`} strokeWidth={1.75} />
      </button>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="min-w-0" role="status">
          <p className={`text-sm font-medium text-green-700`}>
            Order Received
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
            Your Order is Confirmed
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
            <span>Order number</span>
            <span className="break-all font-mono font-medium text-gray-900">{orderNumber}</span>
            <button
              type="button"
              onClick={async () => await navigator.clipboard.writeText(orderNumber)}
              title={"Copy order number"}
              aria-label={"Copy order number"}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-green-50 hover:text-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 ${styles.actions}`}
            >
              <Copy aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className={`flex shrink-0 flex-wrap gap-3 ${styles.actions}`}>
          <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-green-300 hover:bg-green-50 hover:text-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            <Printer aria-hidden="true" className="h-4 w-4" /> Print Order
          </button>
        </div>
      </div>
    </header>
  );
}