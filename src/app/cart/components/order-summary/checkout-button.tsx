"use client";
import { useLinkStatus } from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";

export const CheckoutButtonContent = () => {
	const { pending } = useLinkStatus();
	return (
		<span className="inline-flex items-center gap-2" aria-busy={pending}>
			Proceed to Checkout
			{pending ? (
				<LoaderCircle aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" />
			) : (
				<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
			)}
		</span>
	);
};