import "server-only";
import { ProductImage } from "@/components/product-image";
import { CartItem } from "@/utilities/cart";
import Link from "next/link";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const ItemLines = ({ items }: { items: CartItem[] }) => {
	return (
		<ul className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
			{items.map(({ id, products, quantity }) => (
				<li key={id} className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] items-center gap-3 py-4">
					<Link href={`/product/${products.id}`} aria-label={`View ${products.name}`} className="relative block h-16 w-16 overflow-hidden rounded-md border border-gray-200 bg-white transition-colors hover:border-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
						<ProductImage
							src={products.image_url}
							placeholder="blur"
							blurDataURL="/images/product-placeholder.svg"
							alt={products.name}
							fill
							sizes="64px"
						/>
					</Link>
					<div className="min-w-0">
						<Link href={`/product/${products.id}`} className="block break-words text-sm font-medium leading-5 text-gray-900 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							{products.name}
						</Link>
						<div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
							<p className="text-xs leading-5 text-gray-500">Qty {quantity} &middot; {currency.format(products.price)} each</p>
							<p className="ml-auto text-sm font-semibold tabular-nums text-gray-900">{currency.format(Math.round(products.price * 100) * quantity / 100)}</p>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};