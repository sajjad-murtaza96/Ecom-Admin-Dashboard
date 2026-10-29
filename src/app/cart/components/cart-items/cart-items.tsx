import {
	ArrowLeftIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { removeCartItemAction } from "@/app/actions/supabase/cart";
import { ProductImage } from "@/components/product-image";
import { type CartItem } from "@/utilities/cart";
import { CartItemQuantity } from "./cart-item-quantity";
import { FreeDeliveryProgressBar } from "../order-summary/free-delivery-progress-bar";

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});
const money = (cents: number) => currency.format(cents / 100);

interface CartItemsProps {
	items: CartItem[];
	children?: React.ReactNode;
}

export const CartItems = ({ items, children }: CartItemsProps) => {
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
		<div className="mt-8 grid items-start gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(22rem,1fr)] lg:gap-x-12 lg:gap-y-8">
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
					Continue Shopping
				</Link>
			</section>
			{children}
		</div>
	);
};
