import Link from "next/link";
import classes from "./header.module.css";

export const LogIn = () => {
  return (
    <Link
      href="/login"
      className="text-sm font-semibold leading-6 text-gray-900"
    >
      <div className={classes.cart}>Login</div>
    </Link>
  );
};
