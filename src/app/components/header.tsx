import Link from "next/link";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import { LogIn } from "./login";
import { LogOut } from "./logout";
import classes from "./header.module.css";

const MainHeader: React.FC<{
  isAuth: boolean;
}> = ({ isAuth }) => {
  return (
    <header className="bg-white w-full shadow-md border-b-2">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className='className="-m-1.5 p-1.5"'>
            <BuildingStorefrontIcon className="h-16 w-16 text-indigo-500 cursor-pointer" />
          </Link>
        </div>
        <div className="hidden lg:flex flex-1 justify-end gap-x-12">
          <Link
            href="/"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            <div className={classes.cart}>Shop Now</div>
          </Link>
          {isAuth && (
            <>
              <Link
                href="/product/add"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                <div className={classes.cart}>Add Product</div>
              </Link>
              <LogOut />
            </>
          )}
          {!isAuth && <LogIn />}
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;
