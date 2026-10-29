"use client";
import { useId, useState, type FormEvent } from "react";
import { ChevronDown, CircleAlert, Tag } from "lucide-react";

export function PromoCode() {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(code.trim() ? "Promo codes are not available yet." : "Enter a promo code.");
  };

  return (
    <details className="group mt-5 min-w-0 border-t border-gray-200 pt-5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 [&::-webkit-details-marker]:hidden">
        <Tag aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1">Have a promo code ?</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <form onSubmit={handleSubmit} className="mt-3">
        <label htmlFor={inputId} className="sr-only">Promo code</label>
        <div className="flex min-w-0 items-start gap-2">
          <input
            id={inputId}
            name="promoCode"
            type="text"
            value={code}
            onChange={(event) => { setCode(event.target.value); setError(null); }}
            placeholder="Enter code"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={64}
            aria-invalid={Boolean(error && !code.trim())}
            aria-describedby={error ? errorId : undefined}
            className="min-h-11 min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 aria-invalid:border-red-400"
          />
          <button type="submit" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Apply</button>
        </div>
        {error && <p id={errorId} role="alert" className="mt-3 flex items-start gap-2 text-xs leading-5 text-red-700"><CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></p>}
      </form>
    </details>
  );
}