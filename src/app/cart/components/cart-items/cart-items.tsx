import {
	ArrowLeftIcon,
	ShoppingBagIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { removeCartItemAction } from "@/app/actions/supabase/cart";
import { ProductImage } from "@/components/product-image";
import { type CartItem } from "@/utilities/cart";
import { CartItemQuantity } from "./cart-item-quantity";
import { CartProvider } from "@/context/cart/provider";
import { OrderSummary } from "@/components/order-summary";
import { CartTotals } from "../order-summary/total-lines";

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});
const money = (cents: number) => currency.format(cents / 100);

interface CartItemsProps {
	items: CartItem[];
}

export const CartItems = ({ items }: CartItemsProps) => {
	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center py-20 text-center">
				<ShoppingBagIcon
					aria-hidden="true"
					className="h-12 w-12 text-gray-400"
				/>
				<h2 className="mt-5 text-xl font-semibold">Your cart is empty</h2>
				<Link
					href="/shop"
					className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
				>
					<ArrowLeftIcon aria-hidden="true" className="h-4 w-4" />
					Continue shopping
				</Link>
			</div>
		);
	}

	const Remove = (id: string, name: string) => {
		return (
			<form action={removeCartItemAction.bind(null, id)} className="shrink-0">
				<button
					type="submit"
					aria-label={`Remove ${name}`}
					title="Remove item"
					className="flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600"
				>
					<TrashIcon aria-hidden="true" className="h-5 w-5" />
				</button>
			</form>
		);
	};

	return (
		<CartProvider items={items}>
			<div className="mt-4 grid items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
				<section aria-label="Cart items" className="min-w-0">
					<ul className="divide-y divide-gray-200 border-y border-gray-200">
						{items.map(
							({
								id,
								products: { image_url, id: productId, name, price },
								quantity,
							}) => (
								<li key={id} className="flex min-w-0 gap-4 py-6 sm:gap-6">
									<Link
										href={`/product/${productId}`}
										aria-label={name}
										className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 sm:h-32 sm:w-32"
									>
										<ProductImage
											src={image_url}
											placeholder="blur"
											blurDataURL="/images/product-placeholder.svg"
											alt={name}
											fill
											sizes="(max-width: 639px) 96px, 128px"
										/>
									</Link>
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<Link
													href={`/product/${productId}`}
													className="font-semibold break-words hover:text-indigo-600"
												>
													{name}
												</Link>
												<p className="mt-1 text-sm text-gray-500">
													{money(Math.round(price * 100))} each
												</p>
											</div>
											{Remove(id, name)}
										</div>
										<CartItemQuantity
											itemId={id}
											quantity={quantity}
											productName={name}
											price={price}
										/>
									</div>
								</li>
							),
						)}
					</ul>
					<Link
						href="/shop"
						className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
					>
						<ArrowLeftIcon aria-hidden="true" className="h-4 w-4" />
						Continue shopping
					</Link>
				</section>

				<OrderSummary
					id="cart-order-summary"
					footer={
						<Link
							href="/checkout"
							className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
						>
							Proceed to checkout
						</Link>
					} ><CartTotals /></OrderSummary>
			</div>
		</CartProvider>
	);
};
