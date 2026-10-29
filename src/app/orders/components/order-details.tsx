import { Package, ArrowUpRight } from "lucide-react"
import Link from "next/link";
import React from "react"
import { IOrderHistoryItem } from "@/utilities/order";
import { CopyOrderNumber } from "./copy-order-number";

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});
const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

export const OrderDetails: React.FC<{ order: Omit<IOrderHistoryItem, "orderItems">; total: number | null }> = ({ order, total }) => {
	return (
		<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
			<div className="flex min-w-0 items-start gap-3 sm:gap-4">
				<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
					<Package aria-hidden="true" className="h-5 w-5 text-gray-500" />
				</div>
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
						<h2 id={`order-${order.transactionId}`} className="break-all font-mono text-sm font-semibold text-gray-900">#{order.orderNumber}</h2>
						<CopyOrderNumber orderNumber={order.orderNumber} />
					</div>
					<time dateTime={order.createdAt} className="mt-1 block text-sm text-gray-500">{date.format(new Date(order.createdAt))}</time>
				</div>
			</div>
			<div className="flex items-center justify-between gap-4 sm:gap-8">
				<div className="min-w-0 sm:text-right">
					<p className="text-xs font-medium text-gray-500">Order total</p>
					<p className="mt-1 break-words text-lg font-semibold tabular-nums text-gray-900">{total === null ? "Unavailable" : currency.format(total / 100)}</p>
				</div>
				<Link href={`/checkout/confirmation?transactionId=${encodeURIComponent(order.transactionId)}`} aria-label={`View order ${order.orderNumber}`} className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600">
					View order <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
				</Link>
			</div>
		</div>
	)
}