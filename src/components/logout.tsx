'use client'
import { logout } from "@/app/actions/logout";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import classes from "./header.module.css";
import { redirect } from "next/navigation";

export const LogOut = () => {
  const handleLogOut = async () => {
    logout().then(() => redirect(window.location.pathname));
  };
  return (
    <button
      type="button"
      onClick={handleLogOut}
      className={classes.authLink}
    >
      <ArrowRightStartOnRectangleIcon aria-hidden="true" />
      <span>Sign out</span>
    </button>
  );
};
