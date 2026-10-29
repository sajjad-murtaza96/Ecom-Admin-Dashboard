import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { getOrderHistoryAction } from "@/app/actions/supabase/order";
import { getUser } from "@/db/supabase/query";
import { NoOrders } from "./components/no-orders";
import { OrderHistoryList } from "./components/order-history-list";

export const metadata: Metadata = {
	title: "Order History",
	robots: { index: false, follow: false },
};

const linkStyle = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600";

export default async function OrderHistoryPage({ searchParams }: {
	searchParams: Promise<{ page?: string }>;
}) {
	const { data: { user }, error } = await getUser();
	if (error || !user) redirect("/login");

	const { page: requestedPage } = await searchParams;
	const page = !requestedPage ? 1 : typeof requestedPage === "string" && /^\d+$/.test(requestedPage) ? Number(requestedPage) : 1;
	if (!Number.isSafeInteger(page) || page < 1 || page > 1000000) redirect("/orders");

	const history = await getOrderHistoryAction(user, page);
	if (!history) redirect("/orders");
	if (!history.orders.length) return <NoOrders />;
	if (history && page > Math.max(1, history.totalPages)) {
		redirect(`/orders?page=${Math.max(1, history.totalPages)}`);
	}

	return (
		<main className="min-h-screen bg-white text-gray-900">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
				<header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6 sm:pb-8">
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-2xl font-semibold sm:text-3xl">Order History</h1>
						{history.totalPages > 1 && <span className="text-sm text-gray-500">Page {page} of {history.totalPages}</span>}
					</div>
					<Link href="/shop" className={`${linkStyle} border border-gray-300 hover:bg-gray-50`}>
						<ShoppingBag aria-hidden="true" className="h-4 w-4" /> Continue shopping
					</Link>
				</header>
				{<OrderHistoryList key={page} orders={history.orders} />}
				{history.totalPages > 1 && (
					<nav aria-label="Order history pagination" className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
						{page > 1 ? <Link href={`/orders?page=${page - 1}`} rel="prev" className={`${linkStyle} border border-gray-300 hover:bg-gray-50`}><ArrowLeft aria-hidden="true" className="h-4 w-4" /> Previous</Link> : <span />}
						<p className="text-sm text-gray-500">Page {page} of {history.totalPages}</p>
						{page < history.totalPages ? <Link href={`/orders?page=${page + 1}`} rel="next" className={`${linkStyle} border border-gray-300 hover:bg-gray-50`}>Next <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link> : <span />}
					</nav>
				)}
			</div>
		</main>
	);
}