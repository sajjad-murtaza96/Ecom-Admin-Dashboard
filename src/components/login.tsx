import Link from "next/link";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import classes from "./header.module.css";

export const LogIn = () => {
  return (
    <Link
      href="/login"
      className={classes.authLink}
    >
      <ArrowRightEndOnRectangleIcon aria-hidden="true" />
      <span>Sign in</span>
    </Link>
  );
};
