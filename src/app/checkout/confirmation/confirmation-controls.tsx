"use client";

import { Check, CircleCheck, Clock3, Copy, Printer, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./confirmation.module.css";

export function ConfirmationControls({ orderNumber, confirmed }: { orderNumber: string; confirmed: boolean }) {
  const router = useRouter();
  const [animation, setAnimation] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    if (confirmed) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      router.refresh();
      attempts += 1;
      if (attempts >= 12) window.clearInterval(timer);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [confirmed, router]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyOrderNumber() {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <header className="border-b border-gray-200 pb-8 sm:pb-10">
      {confirmed ? (
        <button
          type="button"
          title="Replay confirmation animation"
          aria-label="Replay confirmation animation"
          onClick={() => setAnimation((current) => current + 1)}
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
        >
          <CircleCheck key={animation} aria-hidden="true" className={`h-11 w-11 ${styles.check}`} strokeWidth={1.75} />
        </button>
      ) : (
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <Clock3 aria-hidden="true" className="h-10 w-10" />
        </div>
      )}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="min-w-0" role="status">
          <p className={`text-sm font-medium ${confirmed ? "text-emerald-700" : "text-amber-700"}`}>
            {confirmed ? "Payment received" : "Awaiting payment confirmation"}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
            {confirmed ? "Your Order is Confirmed" : "Your payment is processing"}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
            <span>Order number</span>
            <span className="break-all font-mono font-medium text-gray-900">{orderNumber}</span>
            <button
              type="button"
              onClick={copyOrderNumber}
              title={copied ? "Order number copied" : "Copy order number"}
              aria-label={copied ? "Order number copied" : "Copy order number"}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${styles.actions}`}
            >
              {copied ? <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
            </button>
            <span className="sr-only" role="status">{copied ? "Order number copied" : ""}</span>
          </div>
          {copyError && <p role="alert" className="mt-2 text-sm text-red-700">Could not copy the order number.</p>}
        </div>
        <div className={`flex shrink-0 flex-wrap gap-3 ${styles.actions}`}>
          {!confirmed && (
            <button type="button" onClick={() => router.refresh()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <RefreshCw aria-hidden="true" className="h-4 w-4" /> Check status
            </button>
          )}
          <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <Printer aria-hidden="true" className="h-4 w-4" /> Print receipt
          </button>
        </div>
      </div>
    </header>
  );
}