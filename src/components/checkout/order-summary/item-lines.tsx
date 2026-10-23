import { CartItem } from "@/utilities/cart";

export const ItemLines = ({ items }: { items: CartItem[] }) => {
	return (
		<ul className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
			{items.map(({ id, products, quantity }) => (
				<li key={id} className="flex justify-between gap-4 py-4 text-sm">
					<span className="min-w-0 break-words text-gray-700">
						{products.name}
						<span className="ml-2 text-gray-500">× {quantity}</span>
					</span>
					<span className="shrink-0 font-medium">
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format((Math.round(products.price * 100) * quantity) / 100)}
					</span>
				</li>
			))}
		</ul>
	);
};