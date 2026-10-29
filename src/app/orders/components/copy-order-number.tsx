"use client";
import { Copy } from "lucide-react";

export const CopyOrderNumber = ({ orderNumber }: { orderNumber: string }) => {
    return (
        <button type="button" onClick={() => navigator.clipboard.writeText(orderNumber)} title="Copy order number" aria-label={`Copy order number ${orderNumber}`} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <Copy aria-hidden="true" className="h-4 w-4" />
        </button>
    );
};