'use client'
import { logout } from "../actions/logout";
import classes from "./header.module.css";
import { redirect } from "next/navigation";

export const LogOut = () => {
  const handleLogOut = async () => {
    logout().then(() => redirect("/login"));
  };
  return (
    <button
      onClick={handleLogOut}
      className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
    >
      <div className={classes.cart}>Logout</div>
    </button>
  );
};
