import Link from "next/link";
import Image from "next/image";
import {
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  ShoppingCartIcon
} from "@heroicons/react/24/outline";
import { LogIn } from "./login";
import { ProfileMenu } from "./profile-menu";
import classes from "./header.module.css";
import { getCartByUserIdAction, getCartItemsAction } from "@/app/actions/supabase/cart";

const MainHeader = async ({ isAuth }: { isAuth: boolean }) => {
  const cart = isAuth ? await getCartByUserIdAction() : undefined;
  const items = cart ? await getCartItemsAction(cart.id) : [];
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
  return (
    <header className={classes.header}>
      <nav
        className={classes.navigation}
        aria-label="Global"
      >
        <Link
          href="/"
          aria-label="Electron home"
          className={classes.logo}
        >
          <Image
            src="/ecom-logo.svg"
            alt="ELECTRON"
            width={224}
            height={48}
            className={classes.logoImage}
            priority
          />
        </Link>
        <div className={classes.links}>
          <Link
            href="/shop"
            className={classes.navLink}
          >
            <ShoppingBagIcon aria-hidden="true" />
            <span>Shop</span>
          </Link>
          {isAuth && (
            <>
              <Link href="/orders" className={classes.navLink}>
                <ClipboardDocumentListIcon aria-hidden="true" />
                <span>My Orders</span>
              </Link>
              <ProfileMenu />
            </>
          )}
          {!isAuth && <LogIn />}
        </div>
        <Link
          href="/cart"
          aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          title="Shopping cart"
          className={classes.cartButton}
        >
          <ShoppingCartIcon aria-hidden="true" />
          {cartCount > 0 && (
            <span
              aria-hidden="true"
              className={classes.count}
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
};

export default MainHeader;
