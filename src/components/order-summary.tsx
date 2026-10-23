import type { ReactNode } from "react";

const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export function OrderSummary({
    id,
    headerAction,
    children,
    footer,
}: {
    id: string;
    headerAction?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
}) {
    return (
        <aside
            aria-labelledby={id}
            className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-5 sm:p-8 lg:sticky lg:top-8"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id={id} className="text-xl font-semibold">
                    Order Summary
                </h2>
                {headerAction}
            </div>
            {children}
            {footer}
        </aside>
    );
}

export function OrderSummaryLines({
    lines,
    total,
    totalLabel = "Estimated total",
    children,

}: {
    lines: { label: string; value: number | string }[];
    total: number;
    totalLabel?: string;
    children?: ReactNode;
}) {
    return (
        <>
            {children}
            <dl className="mt-5 space-y-3 text-sm">
                {lines.map(({ label, value }) => (
                    <div key={label} className="flex flex-wrap justify-between gap-2">
                        <dt className="text-gray-600">{label}</dt>
                        <dd className="break-all font-medium">
                            {typeof value === "number" ? currency.format(value / 100) : value}
                        </dd>
                    </div>
                ))}
                <div
                    className="flex flex-wrap justify-between gap-2 border-t border-gray-200 pt-4 text-base font-semibold"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <dt>{totalLabel}</dt>
                    <dd className="break-all">{currency.format(total / 100)}</dd>
                </div>
            </dl>
        </>
    );
}
