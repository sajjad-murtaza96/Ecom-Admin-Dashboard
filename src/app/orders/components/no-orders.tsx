import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";

export const NoOrders = () => {
	return (
		<section aria-labelledby="no-orders-heading" className="flex flex-col items-center py-16 text-center">
			<Package aria-hidden="true" className="h-10 w-10 text-gray-400" />
			<h2 id="no-orders-heading" className="mt-4 text-lg font-semibold">No Orders available</h2>
			<p className="mt-2 text-sm text-gray-600">Your orders will appear here after checkout.</p>
			<Link href="/shop" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600">
				<ShoppingBag aria-hidden="true" className="h-4 w-4" /> Browse products
			</Link>
		</section>
	);
};