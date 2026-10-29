"use client";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

export const OrderItems = ({ transactionId, quantity, delivery, children }: {
	transactionId: string;
	quantity: number;
	delivery: ReactNode;
	children: ReactNode;
}) => {
	const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
	const expanded = expandedOrder === transactionId;
	return (
		<article aria-labelledby={`order-${transactionId}`}>
			<div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:pl-15">
				<button type="button" aria-expanded={expanded} aria-controls={`items-${transactionId}`} onClick={() => setExpandedOrder(expanded ? null : transactionId)} className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 disabled:cursor-default disabled:text-gray-400">
					{`${quantity} ${quantity === 1 ? "item" : "items"}`}
					<ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} />
				</button>
				{delivery}
			</div>
			<div id={`items-${transactionId}`} hidden={!expanded} className="mt-4 border-t border-dashed border-gray-200 pt-5">
				{children}
			</div>
		</article>
	);
};