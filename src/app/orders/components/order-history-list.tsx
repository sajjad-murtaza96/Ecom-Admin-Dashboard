import "server-only";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { getCartSubtotal } from "@/utilities/cart";
import { computeDeliveryFee } from "@/utilities/checkout";
import { IOrderHistoryItem } from "@/utilities/order";
import { OrderItems } from "./order-items";
import { deliveryIcons } from "@/components/checkout/delivery/delivery-config";
import { OrderDetails } from "./order-details";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

const Delivery = ({ deliveryOption }: { deliveryOption: IOrderHistoryItem["deliveryOption"] }) => {
	const Icon = deliveryIcons[deliveryOption.id];
	return (
		<p className="flex min-w-0 items-center gap-2 text-xs text-gray-500">
			<Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
			<span className="break-words">{deliveryOption.title}</span>
		</p>
	);
};

export const OrderHistoryList = ({ orders }: { orders: IOrderHistoryItem[] }) => {
	return (
		<ol className="divide-y divide-gray-200">
			{orders.map(({ orderItems, ...order }) => {
				const quantity = orderItems.reduce((count, item) => count + item.quantity, 0);
				const subtotal = getCartSubtotal(orderItems);
				const total = orderItems.length && order.deliveryOption ? subtotal + computeDeliveryFee(order.deliveryOption, subtotal) : null;
				return (
					<li key={order.transactionId} className="py-6 sm:py-7">
						<OrderDetails order={order} total={total} />
						<OrderItems
							transactionId={order.transactionId}
							quantity={quantity}
							delivery={<Delivery deliveryOption={order.deliveryOption} />}
						>
							<ul className="grid gap-x-8 md:grid-cols-2">
								{orderItems.map(({ id, products, quantity: itemQuantity }) => (
									<li key={id} className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] items-stretch gap-4 border-b border-gray-100 py-5">
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
										<div className="flex min-w-0 flex-col">
											<Link href={`/product/${products.id}`} className="block break-words text-sm font-medium leading-5 text-gray-900 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
												{products.name}
											</Link>
											<div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pt-2">
												<p className="text-xs leading-5 text-gray-500">
													<span className="block">Qty {itemQuantity}</span>
													<span className="block">{currency.format(products.price)} each</span>
												</p>
												<p className="ml-auto text-right text-sm font-semibold leading-5 tabular-nums text-gray-900">{currency.format(Math.round(products.price * 100) * itemQuantity / 100)}</p>
											</div>
										</div>
									</li>
								))}
							</ul>
						</OrderItems>
					</li>
				);
			})}
		</ol>
	);
};