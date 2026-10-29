"use client";
import { useCart } from "@/context/cart/provider";
import Link from "next/link";
import classes from "./header.module.css";

export const CartIcon = ({ children }: { children: React.ReactNode }) => {
	const { items } = useCart();
	const itemCount = items.reduce((count, item) => count + item.quantity, 0);
	return (
		<Link
			href="/cart"
			aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
			title="Shopping Cart"
			className={classes.cartButton}
		>
			{children}
			{itemCount > 0 && (
				<span
					aria-hidden="true"
					className={classes.count}
				>
					{itemCount > 99 ? "99+" : itemCount}
				</span>
			)}
		</Link>
	)
}